import { NextResponse } from 'next/server'

export interface SecurityHeadersOptions {
  contentSecurityPolicy?: string
  hsts?: {
    maxAge?: number
    includeSubDomains?: boolean
    preload?: boolean
  }
  noSniff?: boolean
  frameOptions?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM'
  xssProtection?: boolean
  referrerPolicy?: string
  permissionsPolicy?: string
}

const defaultOptions: SecurityHeadersOptions = {
  contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'",
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: false
  },
  noSniff: true,
  frameOptions: 'DENY',
  xssProtection: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: 'geolocation=(), microphone=(), camera=()'
}

export function addSecurityHeaders(
  response: NextResponse,
  options: SecurityHeadersOptions = {}
): NextResponse {
  const config = { ...defaultOptions, ...options }

  // Content Security Policy
  if (config.contentSecurityPolicy) {
    response.headers.set('Content-Security-Policy', config.contentSecurityPolicy)
  }

  // HTTP Strict Transport Security (HSTS)
  if (config.hsts && config.hsts.maxAge) {
    let hstsValue = `max-age=${config.hsts.maxAge}`
    if (config.hsts.includeSubDomains) {
      hstsValue += '; includeSubDomains'
    }
    if (config.hsts.preload) {
      hstsValue += '; preload'
    }
    response.headers.set('Strict-Transport-Security', hstsValue)
  }

  // X-Content-Type-Options
  if (config.noSniff) {
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }

  // X-Frame-Options
  if (config.frameOptions) {
    response.headers.set('X-Frame-Options', config.frameOptions)
  }

  // X-XSS-Protection
  if (config.xssProtection) {
    response.headers.set('X-XSS-Protection', '1; mode=block')
  }

  // Referrer-Policy
  if (config.referrerPolicy) {
    response.headers.set('Referrer-Policy', config.referrerPolicy)
  }

  // Permissions-Policy
  if (config.permissionsPolicy) {
    response.headers.set('Permissions-Policy', config.permissionsPolicy)
  }

  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  return response
}

export function createSecureResponse(
  data: any,
  options: SecurityHeadersOptions & { status?: number } = {}
): NextResponse {
  const { status = 200, ...securityOptions } = options
  const response = NextResponse.json(data, { status })
  return addSecurityHeaders(response, securityOptions)
}

export function createSecureErrorResponse(
  error: string,
  status: number = 500,
  options: SecurityHeadersOptions = {}
): NextResponse {
  // Don't leak sensitive error information in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  const safeError = isDevelopment ? error : 'Internal server error'

  const response = NextResponse.json(
    { error: safeError, type: 'ERROR' },
    { status }
  )
  return addSecurityHeaders(response, options)
}
