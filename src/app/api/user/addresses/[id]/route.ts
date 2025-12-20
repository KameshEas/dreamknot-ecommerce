import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { id } = await params
    const addressId = parseInt(id)

    const { name, address_line, city, state, zip, country, is_default } = await request.json()

    if (!name || !address_line || !city || !country) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await prisma.address.updateMany({
        where: {
          user_id: decoded.userId,
          id: { not: addressId }
        },
        data: { is_default: false }
      })
    }

    const address = await prisma.address.update({
      where: { id: addressId, user_id: decoded.userId },
      data: {
        name,
        address_line,
        city,
        state: state || '',
        zip: zip || '',
        country,
        is_default: is_default || false
      }
    })

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { id } = await params
    const addressId = parseInt(id)

    await prisma.address.delete({
      where: { id: addressId, user_id: decoded.userId }
    })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
