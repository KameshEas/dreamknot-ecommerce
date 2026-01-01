import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
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

export async function getAuthUser(request: NextRequest): Promise<AuthUser> {
  const token = request.cookies.get('token')?.value

  if (!token) {
    throw new AuthError('No authentication token provided', 401)
  }

  const decoded = verifyToken(token)

  // Fetch user data from database
  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true }
  }) as { id: number; email: string; name: string | null; role: string } | null

  if (!user) {
    throw new AuthError('User not found', 404)
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name || 'Unknown',
    role: user.role
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

  // Fetch user data from database
  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true }
  }) as any // Type assertion until Prisma client is regenerated

  if (!user) {
    throw new AuthError('User not found', 404)
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name || 'Unknown',
    role: user.role
  }
}
