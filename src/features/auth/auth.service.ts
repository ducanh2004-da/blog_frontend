// src/features/auth/auth.service.ts
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
      variables: { data: { email, password } }
    });
    return response.data.data.login;
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
      variables: { data: { address, email, password, phoneNumber, username } }
    });
    return response.data.data.register;
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
      variables: { idToken }
    });
    return response.data.data.googleLogin;
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
    });
    return response.data.data.logout;
  },

  // Preferred: server exposes currentUser that reads cookie and returns the user
  getCurrentUser: async () => {
    const response = await apiConfig.post('', {
      query: `
        query CurrentUser {
          currentUser {
            data {
              id
              username
              email
              role
              avatar
              phoneNumber
              createdAt
              updatedAt
            }
            message
          }
        }
      `
    });
    // adjust according to your GraphQL return shape
    return response.data.data.currentUser?.data ?? null;
  },

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
    });
    return response.data.data.refresh;
  }
}
