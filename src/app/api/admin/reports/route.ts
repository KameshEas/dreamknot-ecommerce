import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Check if user is admin or staff
function isAdminOrStaff(user: any): boolean {
  return user.role === 'admin' || user.role === 'staff'
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!isAdminOrStaff(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const format = searchParams.get('format') || 'json' // json, csv

    const dateFilter = startDate && endDate ? {
      created_at: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } : {}

    let reportData: any = {}

    switch (reportType) {
      case 'overview':
        reportData = await getOverviewReport(dateFilter)
        break
      case 'sales':
        reportData = await getSalesReport(dateFilter)
        break
      case 'products':
        reportData = await getProductsReport(dateFilter)
        break
      case 'customers':
        reportData = await getCustomersReport(dateFilter)
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    if (format === 'csv') {
      return generateCSVResponse(reportData, reportType)
    }

    return NextResponse.json(reportData)
  } catch (error) {
    return handleApiError(error)
  }
}

async function getOverviewReport(dateFilter: any) {
  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    totalProducts,
    orderStatusCounts,
    recentOrders
  ] = await Promise.all([
    prisma.order.count({ where: dateFilter }),
    prisma.order.aggregate({
      where: { ...dateFilter, payment_status: 'paid' },
      _sum: { total_amount: true }
    }),
    prisma.user.count({ where: { role: 'customer' } as any }),
    prisma.product.count(),
    prisma.order.groupBy({
      by: ['order_status'],
      where: dateFilter,
      _count: { id: true }
    }),
    prisma.order.findMany({
      where: dateFilter,
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    })
  ])

  return {
    summary: {
      total_orders: totalOrders,
      total_revenue: totalRevenue._sum.total_amount || 0,
      total_customers: totalCustomers,
      total_products: totalProducts
    },
    order_status_breakdown: orderStatusCounts.map(status => ({
      status: status.order_status,
      count: status._count.id
    })),
    recent_orders: recentOrders
  }
}

async function getSalesReport(dateFilter: any) {
  const salesData = await prisma.$queryRaw`
    SELECT
      DATE(created_at) as date,
      COUNT(*) as orders_count,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avg_order_value
    FROM orders
    WHERE ${dateFilter.created_at ? 'created_at >= ? AND created_at <= ?' : '1=1'}
    AND payment_status = 'paid'
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  ` as any

  const topProducts = await prisma.orderItem.groupBy({
    by: ['product_id'],
    where: {
      order: dateFilter
    },
    _sum: { qty: true },
    _count: { id: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: 10
  })

  const productsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
        select: { title: true, base_price: true }
      })
      return {
        product_id: item.product_id,
        product_name: product?.title || 'Unknown',
        total_sold: item._sum.qty || 0,
        order_count: item._count.id,
        revenue: (item._sum.qty || 0) * (product?.base_price || 0)
      }
    })
  )

  return {
    daily_sales: salesData,
    top_products: productsWithDetails
  }
}

async function getProductsReport(dateFilter: any) {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      _count: {
        select: {
          order_items: true,
          reviews: true
        }
      },
      order_items: {
        where: {
          order: dateFilter
        },
        select: {
          qty: true,
          price: true
        }
      }
    }
  }) as any

  const productsWithStats = products.map((product: any) => {
    const totalSold = product.order_items.reduce((sum: number, item: any) => sum + item.qty, 0)
    const totalRevenue = product.order_items.reduce((sum: number, item: any) => sum + (item.qty * item.price), 0)
    const avgRating = product._count.reviews > 0 ?
      (product.reviews as any)?.reduce((sum: number, review: any) => sum + review.rating, 0) / product._count.reviews : 0

    return {
      id: product.id,
      title: product.title,
      category: product.category.name,
      base_price: product.base_price,
      stock_quantity: product.stock_quantity,
      is_available: product.is_available,
      total_sold: totalSold,
      total_revenue: totalRevenue,
      review_count: product._count.reviews,
      average_rating: avgRating
    }
  })

  return {
    products: productsWithStats
  }
}

async function getCustomersReport(dateFilter: any) {
  const customers = await prisma.user.findMany({
    where: { role: 'customer' } as any,
    include: {
      orders: {
        where: dateFilter,
        select: {
          total_amount: true,
          created_at: true
        }
      },
      _count: {
        select: {
          orders: true,
          reviews: true,
          addresses: true
        }
      }
    }
  }) as any

  const customersWithStats = customers.map((customer: any) => {
    const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + order.total_amount, 0)
    const lastOrderDate = customer.orders.length > 0 ?
      customer.orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at : null

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      total_orders: customer._count.orders,
      total_spent: totalSpent,
      last_order_date: lastOrderDate,
      review_count: customer._count.reviews,
      address_count: customer._count.addresses,
      created_at: customer.created_at
    }
  })

  return {
    customers: customersWithStats
  }
}

function generateCSVResponse(data: any, reportType: string): NextResponse {
  let csvContent = ''

  switch (reportType) {
    case 'products':
      csvContent = 'ID,Title,Category,Price,Stock,Available,Total Sold,Total Revenue,Reviews,Average Rating\n'
      data.products.forEach((product: any) => {
        csvContent += `${product.id},"${product.title}","${product.category}",${product.base_price},${product.stock_quantity},${product.is_available},${product.total_sold},${product.total_revenue},${product.review_count},${product.average_rating}\n`
      })
      break
    case 'customers':
      csvContent = 'ID,Name,Email,Phone,Total Orders,Total Spent,Last Order Date,Reviews,Addresses,Created At\n'
      data.customers.forEach((customer: any) => {
        csvContent += `${customer.id},"${customer.name}","${customer.email}","${customer.phone}",${customer.total_orders},${customer.total_spent},"${customer.last_order_date}","${customer.review_count}","${customer.address_count}","${customer.created_at}"\n`
      })
      break
  }

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${reportType}_report.csv"`
    }
  })
}
