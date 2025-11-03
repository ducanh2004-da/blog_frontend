// types/auth.types.ts

export interface DecodedToken {
  id: string
  email: string
  role: string
  username: string
  iat?: number
  exp?: number
}

export interface GoogleUserInfo {
  name: string
  email: string
  picture: string
}

export interface UserDetails {
  id: string
  email: string
  username: string
  role: string
  address?: string
  phoneNumber?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  accessToken?: string
  refreshToken?: string
}

export interface AuthStore {
  user: DecodedToken | null
  userDetails: UserDetails | null
  googleInfo: GoogleUserInfo | null
  isAuthenticated: boolean
  
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (address: string, email: string, username: string, phoneNumber: string, password: string) => Promise<AuthResponse>
  loginWithGoogle: (idToken: string, googleInfo?: GoogleUserInfo) => Promise<AuthResponse>
  logout: () => Promise<void>
  getUserInfo: () => Promise<UserDetails>
  initAuth: () => Promise<void>
  setGoogleInfo: (info: GoogleUserInfo) => void
  clearGoogleInfo: () => void
}