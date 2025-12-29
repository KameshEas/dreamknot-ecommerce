import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { AuthService } from '@/services/auth.service'
import { authSchemas } from '@/lib/validation'

export async function POST(request: NextRequest) {
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
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    return handleApiError(error)
  }
}
