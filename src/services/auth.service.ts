import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createAuthToken } from '@/lib/auth'
import { ConflictError, NotFoundError } from '@/lib/errors'

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface AuthResult {
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export class AuthService {
  static async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      throw new NotFoundError('User') // Same error to prevent user enumeration
    }

    // Create JWT
    const token = createAuthToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }
  }

  static async signup(data: SignupData): Promise<AuthResult> {
    const { name, email, password } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new ConflictError('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword
      }
    })

    // Create JWT
    const token = createAuthToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    }
  }

  static async changePassword(userId: number, data: ChangePasswordData): Promise<void> {
    const { currentPassword, newPassword } = data

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundError('User')
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValidPassword) {
      throw new ConflictError('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedPassword }
    })
  }

  static async logout(): Promise<void> {
    // In a stateless JWT setup, logout is handled client-side
    // by removing the token. No server-side action needed.
    return Promise.resolve()
  }
}
