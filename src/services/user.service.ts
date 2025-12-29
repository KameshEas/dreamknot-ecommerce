import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export interface UpdateProfileData {
  name?: string
  phone?: string
  avatar?: string
  date_of_birth?: string
  gender?: 'male' | 'female' | 'other'
  bio?: string
  preferences?: Record<string, any>
  email_notifications?: boolean
  sms_notifications?: boolean
}

export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string | null
  avatar: string | null
  date_of_birth: Date | null
  gender: string | null
  bio: string | null
  preferences: any
  email_notifications: boolean
  sms_notifications: boolean
  created_at: Date
  updated_at: Date
  _count: {
    orders: number
    wishlists: number
    addresses: number
  }
}

export class UserService {
  static async getProfile(userId: number): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      throw new NotFoundError('User')
    }

    return user
  }

  static async updateProfile(userId: number, data: UpdateProfileData): Promise<UserProfile> {
    const updateData: any = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.avatar !== undefined) updateData.avatar = data.avatar
    if (data.date_of_birth !== undefined) updateData.date_of_birth = new Date(data.date_of_birth)
    if (data.gender !== undefined) updateData.gender = data.gender
    if (data.bio !== undefined) updateData.bio = data.bio
    if (data.preferences !== undefined) updateData.preferences = JSON.stringify(data.preferences)
    if (data.email_notifications !== undefined) updateData.email_notifications = data.email_notifications
    if (data.sms_notifications !== undefined) updateData.sms_notifications = data.sms_notifications

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return user
  }

  static async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    return user
  }

  static async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    return user
  }
}
