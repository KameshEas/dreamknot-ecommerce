import { NextResponse } from 'next/server'
import { AuthError } from './auth'
import { ValidationError } from './validation'
import { createSecureErrorResponse } from './security-headers'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404)
    this.name = 'NotFoundError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        field: error.field,
        type: 'VALIDATION_ERROR'
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof AuthError) {
    return NextResponse.json(
      {
        error: error.message,
        type: 'AUTH_ERROR'
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        error: error.message,
        type: 'NOT_FOUND_ERROR'
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      {
        error: error.message,
        type: 'FORBIDDEN_ERROR'
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ConflictError) {
    return NextResponse.json(
      {
        error: error.message,
        type: 'CONFLICT_ERROR'
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        type: 'APP_ERROR'
      },
      { status: error.statusCode }
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any

    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'A record with this information already exists',
          type: 'DUPLICATE_ERROR'
        },
        { status: 409 }
      )
    }

    // Foreign key constraint violation
    if (prismaError.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'Referenced record does not exist',
          type: 'FOREIGN_KEY_ERROR'
        },
        { status: 400 }
      )
    }

    // Record not found
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: 'Record not found',
          type: 'NOT_FOUND_ERROR'
        },
        { status: 404 }
      )
    }
  }

  // Handle fetch errors (external API calls)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return NextResponse.json(
      {
        error: 'External service unavailable',
        type: 'SERVICE_ERROR'
      },
      { status: 503 }
    )
  }

  // Generic error handling
  const isDevelopment = process.env.NODE_ENV === 'development'

  return NextResponse.json(
    {
      error: isDevelopment ? (error as Error)?.message || 'Internal server error' : 'Internal server error',
      type: 'INTERNAL_ERROR',
      ...(isDevelopment && { stack: (error as Error)?.stack })
    },
    { status: 500 }
  )
}

export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
