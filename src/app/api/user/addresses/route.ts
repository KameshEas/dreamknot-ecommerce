import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Get user addresses
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const addresses = await prisma.address.findMany({
      where: { user_id: decoded.userId },
      orderBy: { is_default: 'desc' }
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create new address
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { name, address_line, city, state, zip, country, is_default } = await request.json()

    if (!name || !address_line || !city || !country) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await prisma.address.updateMany({
        where: { user_id: decoded.userId },
        data: { is_default: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        user_id: decoded.userId,
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
    console.error('Create address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
