import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { authRateLimit } from '@/lib/rate-limit'
import { AuthService } from '@/services/auth.service'
import { authSchemas } from '@/lib/validation'

async function loginHandler(request: NextRequest) {
  try {
    const loginData = await validateRequest(request, authSchemas.login)
    const result = await AuthService.login(loginData)

    // Set cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: result.user
    })

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    return handleApiError(error)
  }
}

export const POST = authRateLimit(loginHandler)
