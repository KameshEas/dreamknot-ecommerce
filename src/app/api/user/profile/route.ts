import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        date_of_birth: true,
        gender: true,
        bio: true,
        preferences: true,
        email_notifications: true,
        sms_notifications: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            orders: true,
            wishlists: true,
            addresses: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const body = await request.json()

    const {
      name,
      phone,
      avatar,
      date_of_birth,
      gender,
      bio,
      preferences,
      email_notifications,
      sms_notifications
    } = body

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
        ...(date_of_birth && { date_of_birth: new Date(date_of_birth) }),
        ...(gender && { gender }),
        ...(bio !== undefined && { bio }),
        ...(preferences && { preferences: JSON.stringify(preferences) }),
        ...(email_notifications !== undefined && { email_notifications }),
        ...(sms_notifications !== undefined && { sms_notifications })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        date_of_birth: true,
        gender: true,
        bio: true,
        preferences: true,
        email_notifications: true,
        sms_notifications: true,
        updated_at: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Change password
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password_hash: hashedPassword }
    })

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
