import { NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { CategoriesService } from '@/services/categories.service'

export async function GET() {
  try {
    const result = await CategoriesService.getCategories()
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
