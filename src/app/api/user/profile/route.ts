import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { UserService } from '@/services/user.service'
import { AuthService } from '@/services/auth.service'
import { userSchemas, authSchemas } from '@/lib/validation'

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const user = await UserService.getProfile(authUser.id)
    return NextResponse.json({ user })
  } catch (error) {
    return handleApiError(error)
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const updateData = await validateRequest(request, userSchemas.updateProfile)
    const user = await UserService.updateProfile(authUser.id, updateData)
    return NextResponse.json({ user })
  } catch (error) {
    return handleApiError(error)
  }
}

// Change password
export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const passwordData = await validateRequest(request, authSchemas.changePassword)
    await AuthService.changePassword(authUser.id, passwordData)
    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
