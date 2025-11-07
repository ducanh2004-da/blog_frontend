// ==================== Token Types ====================

/**
 * Decoded JWT access token payload
 */
export interface DecodedToken {
  id: string
  email: string
  username: string
  role: string
  iat?: number // Issued at timestamp
  exp?: number // Expiration timestamp
}

// ==================== User Types ====================

/**
 * Full user details from backend
 */
export interface UserDetails {
  id: string
  email: string
  username: string
  role: string
  address?: string
  avatar?: string
  phoneNumber?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Google OAuth user information
 */
export interface GoogleUserInfo {
  name: string
  email: string
  picture: string
  sub?: string // Google user ID
  email_verified?: boolean
  given_name?: string
  family_name?: string
  locale?: string
}

// ==================== Auth Response Types ====================

/**
 * Generic response for mutations
 */
export interface GenericResponse {
  success: boolean
  message: string
}

/**
 * Authentication response with tokens
 */
export interface AuthResponse {
  success: boolean
  message: string
  accessToken?: string
  refreshToken?: string
}

/**
 * Login response
 */
export interface LoginResponse extends AuthResponse {}

/**
 * Register response
 */
export interface RegisterResponse extends GenericResponse {}

/**
 * Refresh token response
 */
export interface RefreshResponse extends GenericResponse {}

/**
 * Logout response
 */
export interface LogoutResponse extends GenericResponse {}

// ==================== Auth Store Types ====================

/**
 * Zustand auth store interface
 */
export interface AuthStore {
  // State
  user: DecodedToken | null
  userDetails: UserDetails | null
  googleInfo: GoogleUserInfo | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (
    // Note: parameter order matches the usage in `auth.store.ts` where
    // the store calls `authService.register(address, email, password, phoneNumber, username)`.
    // Keep `password` directly after `email` to reflect that callsite.
    address: string,
    email: string,
    password: string,
    phoneNumber?: string,
    username?: string
  ) => Promise<RegisterResponse>
  loginWithGoogle: (
    idToken: string,
    googleInfo?: GoogleUserInfo
  ) => Promise<AuthResponse>
  logout: () => Promise<void>
  getUserInfo: () => Promise<UserDetails>
  initAuth: () => Promise<void>
  setGoogleInfo: (info: GoogleUserInfo) => void
  clearGoogleInfo: () => void
}

// ==================== Form Data Types ====================

/**
 * Login form data
 */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Register form data
 */
export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber?: string
  address?: string
  acceptTerms: boolean
}

/**
 * Form validation errors
 */
export interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  phoneNumber?: string
  address?: string
  general?: string
}

// ==================== API Error Types ====================

/**
 * GraphQL error structure
 */
export interface GraphQLError {
  message: string
  extensions?: {
    code?: string
    statusCode?: number
    [key: string]: any
  }
  path?: string[]
  locations?: Array<{
    line: number
    column: number
  }>
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  errors?: GraphQLError[]
  data?: null
}

/**
 * Axios error with API response
 */
export interface ApiError extends Error {
  response?: {
    data?: ApiErrorResponse
    status?: number
    statusText?: string
  }
}

// ==================== Cookie Types ====================

/**
 * Cookie options for authentication
 */
export interface CookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  path: string
  maxAge: number
}

// ==================== Auth Context Types ====================

/**
 * Auth context value (nếu sử dụng React Context thay vì Zustand)
 */
export interface AuthContextValue extends AuthStore {}

// ==================== Role & Permission Types ====================

/**
 * User roles
 *
 * Using a const object with a string-union type to avoid emitting runtime enum
 * code when only erasable TypeScript syntax is allowed.
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  SUBSCRIBER: 'SUBSCRIBER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Permission check result
 */
export interface PermissionCheck {
  hasPermission: boolean
  reason?: string
}

// ==================== Token Status Types ====================

/**
 * Token validation status
 */
export const TokenStatus = {
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  INVALID: 'INVALID',
  NOT_FOUND: 'NOT_FOUND'
} as const;

export type TokenStatus = typeof TokenStatus[keyof typeof TokenStatus];

/**
 * Token info
 */
export interface TokenInfo {
  status: TokenStatus
  decoded?: DecodedToken
  expiresIn?: number // seconds until expiration
  issuedAt?: Date
  expiresAt?: Date
}

// ==================== Helper Type Guards ====================

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'response' in error
}

/**
 * Type guard to check if user has specific role
 */
export function hasRole(user: DecodedToken | null, role: UserRole): boolean {
  return user?.role === role
}

/**
 * Type guard to check if user has any of the roles
 */
export function hasAnyRole(user: DecodedToken | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role as UserRole) : false
}

/**
 * Check if token is expired
 */
export function isTokenExpired(decoded: DecodedToken): boolean {
  if (!decoded.exp) return false
  return Date.now() >= decoded.exp * 1000
}

/**
 * Get time until token expires (in seconds)
 */
export function getTokenExpiresIn(decoded: DecodedToken): number | null {
  if (!decoded.exp) return null
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
  return expiresIn > 0 ? expiresIn : 0
}

// ==================== Constants ====================

/**
 * Auth-related constants
 */
export const AUTH_CONSTANTS = {
  // Cookie names
  COOKIE_ACCESS_TOKEN: 'Authentication',
  COOKIE_REFRESH_TOKEN: 'Refresh',
  
  // Token expiration times (in seconds)
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  
  // Storage keys (nếu cần)
  STORAGE_KEY_GOOGLE_INFO: 'auth-storage',
  
  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid authentication token',
    TOKEN_NOT_FOUND: 'No authentication token found',
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Registration successful! Please login.',
    PASSWORD_CHANGED: 'Password changed successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
  }
} as const
