import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: number
  email: string
}

export interface JWTPayload {
  userId: number
  email: string
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  } catch (error) {
    throw new AuthError('Invalid or expired token', 401)
  }
}

export function getAuthUser(request: NextRequest): AuthUser {
  const token = request.cookies.get('token')?.value

  if (!token) {
    throw new AuthError('No authentication token provided', 401)
  }

  const decoded = verifyToken(token)
  return {
    id: decoded.userId,
    email: decoded.email
  }
}

export function createAuthToken(userId: number, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

export async function getAuthUserFromCookies(): Promise<AuthUser> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new AuthError('No authentication token provided', 401)
  }

  const decoded = verifyToken(token)
  return {
    id: decoded.userId,
    email: decoded.email
  }
}
