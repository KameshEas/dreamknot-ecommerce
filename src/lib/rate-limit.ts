import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting store
// In production, use Redis or a database
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string // Function to generate rate limit key
  skipSuccessfulRequests?: boolean // Skip rate limiting for successful requests
  skipFailedRequests?: boolean // Skip rate limiting for failed requests
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  limit: number
}

const defaultKeyGenerator = (request: NextRequest): string => {
  // Use IP address as key, fallback to a default for development
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown'

  // For API routes, also include the route path to limit per endpoint
  const url = new URL(request.url)
  return `${ip}:${url.pathname}`
}

export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options

  const key = keyGenerator(request)
  const now = Date.now()

  // Clean up expired entries (simple cleanup, not optimal for high traffic)
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) {
        rateLimitStore.delete(k)
      }
    }
  }

  let entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new entry
    entry = {
      count: 0,
      resetTime: now + windowMs
    }
    rateLimitStore.set(key, entry)
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      limit: maxRequests
    }
  }

  // Increment counter
  entry.count++

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
    limit: maxRequests
  }
}

export function createRateLimitMiddleware(options: RateLimitOptions) {
  return function rateLimitMiddleware(handler: Function) {
    return async (request: NextRequest, ...args: any[]) => {
      const result = checkRateLimit(request, options)

      if (!result.success) {
        // Rate limit exceeded
        const response = NextResponse.json(
          {
            error: 'Too many requests',
            type: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString()
            }
          }
        )
        return response
      }

      // Add rate limit headers to successful response
      const response = await handler(request, ...args)

      if (response && typeof response.headers?.set === 'function') {
        response.headers.set('X-RateLimit-Limit', result.limit.toString())
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())
      }

      return response
    }
  }
}

// Pre-configured rate limiters for common use cases
export const authRateLimit = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  keyGenerator: (request) => {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown'
    return `auth:${ip}`
  }
})

export const apiRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (request) => {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown'
    return `api:${ip}`
  }
})

export const strictRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  keyGenerator: (request) => {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const url = new URL(request.url)
    return `strict:${ip}:${url.pathname}`
  }
})
