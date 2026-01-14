/**
 * API Helper Utilities
 * Provides consistent response formatting, error handling, and authentication helpers
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { formatValidationErrors } from './validation';

// ============================================================================
// Response Types
// ============================================================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Send a successful API response
 * @param res Next.js response object
 * @param data Response data
 * @param message Optional success message
 * @param statusCode HTTP status code (default: 200)
 */
export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  message?: string,
  statusCode: number = 200
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  res.status(statusCode).json(response);
}

/**
 * Send an error API response
 * @param res Next.js response object
 * @param code Error code
 * @param message Error message
 * @param statusCode HTTP status code (default: 400)
 * @param details Optional error details
 */
export function sendError(
  res: NextApiResponse,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any
): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
  res.status(statusCode).json(response);
}

// ============================================================================
// Error Classes
// ============================================================================

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super('RATE_LIMIT_EXCEEDED', message, 429);
    this.name = 'RateLimitError';
  }
}

// ============================================================================
// Error Handler Middleware
// ============================================================================

/**
 * Global error handler for API routes
 * Catches errors and sends consistent error responses
 */
export function handleApiError(error: unknown, res: NextApiResponse): void {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    sendError(res, error.code, error.message, error.statusCode, error.details);
  } else if (error instanceof z.ZodError) {
    const validationErrors = formatValidationErrors(error);
    sendError(res, 'VALIDATION_ERROR', 'Validation failed', 400, validationErrors);
  } else if (error instanceof Error) {
    sendError(res, 'INTERNAL_ERROR', error.message, 500);
  } else {
    sendError(res, 'UNKNOWN_ERROR', 'An unexpected error occurred', 500);
  }
}

// ============================================================================
// Request Validation
// ============================================================================

/**
 * Validate request body against Zod schema
 * @param req Next.js request object
 * @param schema Zod schema for validation
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export function validateRequestBody<T extends z.ZodTypeAny>(
  req: NextApiRequest,
  schema: T
): z.infer<T> {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = formatValidationErrors(result.error);
    throw new ValidationError('Request validation failed', errors);
  }

  return result.data;
}

/**
 * Validate query parameters against Zod schema
 * @param req Next.js request object
 * @param schema Zod schema for validation
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export function validateQueryParams<T extends z.ZodTypeAny>(
  req: NextApiRequest,
  schema: T
): z.infer<T> {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const errors = formatValidationErrors(result.error);
    throw new ValidationError('Query parameter validation failed', errors);
  }

  return result.data;
}

// ============================================================================
// HTTP Method Guards
// ============================================================================

/**
 * Ensure request uses allowed HTTP method
 * @param req Next.js request object
 * @param res Next.js response object
 * @param allowedMethods Array of allowed HTTP methods
 * @returns true if method is allowed
 */
export function ensureMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods.join(', '));
    sendError(res, 'METHOD_NOT_ALLOWED', `Method ${req.method} not allowed`, 405);
    return false;
  }
  return true;
}

// ============================================================================
// Rate Limiting (Simple In-Memory)
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in-memory rate limiter
 * @param identifier Unique identifier (e.g., IP, session ID)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 * @returns true if request is allowed
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return false;
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * Rate limit middleware for API routes
 * @param identifier Unique identifier (e.g., IP, session ID)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 * @throws RateLimitError if rate limit exceeded
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): void {
  if (!checkRateLimit(identifier, maxRequests, windowMs)) {
    throw new RateLimitError(`Rate limit exceeded. Please try again later.`);
  }
}

// ============================================================================
// CORS Headers (for Vercel serverless functions)
// ============================================================================

/**
 * Set CORS headers for API responses
 * @param res Next.js response object
 * @param allowedOrigins Array of allowed origins (default: all)
 */
export function setCorsHeaders(
  res: NextApiResponse,
  allowedOrigins: string[] = ['*']
): void {
  const origin = allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', ');

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

/**
 * Handle OPTIONS preflight requests
 * @param req Next.js request object
 * @param res Next.js response object
 * @returns true if OPTIONS request was handled
 */
export function handleCorsPreflightOptions(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.status(200).end();
    return true;
  }
  return false;
}
