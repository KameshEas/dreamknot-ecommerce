import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// For simplicity, we'll skip admin authentication for now
// In production, you'd check for admin role

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        order_items: {
          include: {
            product: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Get admin orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
