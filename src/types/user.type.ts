interface User {
  id?: string
  username?: string
  email?: string
  phoneNumber?: string
  avatar?: string
  role?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export type {
  User
}