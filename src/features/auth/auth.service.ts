import apiConfig from './../../configs/api.config';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiConfig.post('', {
      query: `
        mutation Login($data: LoginDto!) {
          login(data: $data) {
            accessToken
            message
            refreshToken
            success
          }
        }
      `,
      variables: {
        data: {
          email,
          password
        }
      }
    })
    return response.data.data.login
  },

  register: async (address: string, email: string, password: string, phoneNumber: string, username: string) => {
    const response = await apiConfig.post('', {
      query: `
        mutation Register($data: RegisterDto!) {
          register(data: $data) {
            message
            success
          }
        }
      `,
      variables: {
        data: {
          address,
          email,
          password,
          phoneNumber,
          username
        }
      }
    })
    return response.data.data.register
  },

  loginWithGoogle: async (idToken: string) => {
    const response = await apiConfig.post('', {
      query: `
        mutation GoogleLogin($idToken: String!) {
          googleLogin(idToken: $idToken) {
            accessToken
            message
            refreshToken
            success
          }
        }
      `,
      variables: {
        idToken
      }
    })
    return response.data.data.googleLogin
  },

  logout: async () => {
    const response = await apiConfig.post('', {
      query: `
        mutation Logout {
          logout {
            message
            success
          }
        }
      `,
      variables: {}
    })
    return response.data.data.logout
  },

  // Query để lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await apiConfig.post('', {
      query: `
        query GetCurrentUser {
          getCurrentUser {
            id
            email
            username
            role
            address
            phoneNumber
          }
        }
      `
    })
    return response.data.data.getCurrentUser
  },

  // Refresh token mutation (được gọi tự động trong interceptor)
  refreshTokens: async () => {
    const response = await apiConfig.post('', {
      query: `
        mutation Refresh {
          refresh {
            success
            message
          }
        }
      `
    })
    return response.data.data.refresh
  }
}