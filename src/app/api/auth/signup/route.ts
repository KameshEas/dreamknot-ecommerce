import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { authRateLimit } from '@/lib/rate-limit'
import { AuthService } from '@/services/auth.service'
import { authSchemas } from '@/lib/validation'

async function signupHandler(request: NextRequest) {
  try {
    const signupData = await validateRequest(request, authSchemas.signup)
    const result = await AuthService.signup(signupData)

    // Set cookie
    const response = NextResponse.json({
      message: 'User created successfully',
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

export const POST = authRateLimit(signupHandler)
