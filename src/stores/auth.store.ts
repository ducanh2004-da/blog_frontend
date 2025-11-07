// src/stores/auth.store.ts
import { create } from 'zustand';
import { AuthStore, DecodedToken, GoogleUserInfo } from '../types';
import { authService } from '../features/auth/auth.service';
import { toast } from 'sonner';
import { queryClient } from '../configs/query-client.config';

export const useAuthStore = create<AuthStore>()((set, get): AuthStore => ({
  user: null,
  userDetails: null,
  googleInfo: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const loginResult = await authService.login(email, password);

      if (loginResult.success) {
        // Prefer to fetch current user based on httpOnly cookie
        try {
          const userDetails = await authService.getCurrentUser();
          if (userDetails) {
            set({
              userDetails,
              user: {
                id: userDetails.id,
                email: userDetails.email,
                username: userDetails.username,
                role: userDetails.role
              } as DecodedToken,
              isAuthenticated: true,
              isLoading: false
            });
            toast.success(loginResult.message || 'Login successful');
            return loginResult;
          }
        } catch (err) {
          // fallback: if server doesn't support currentUser, decode accessToken (less secure)
          try {
            // @ts-ignore
            const decoded = (window as any).jwtDecode ? (window as any).jwtDecode(loginResult.accessToken) : null;
            set({
              user: decoded,
              isAuthenticated: true,
              isLoading: false
            });
            // Attempt to fetch full user details by id (if you have GetUserById)
            try {
              const userDetails = await authService.getCurrentUser(); // maybe uses GetUserById with id
              set({ userDetails });
            } catch {}
            toast.success(loginResult.message || 'Login successful (fallback)');
            return loginResult;
          } catch (e) {
            // can't decode either
          }
        }
      }

      throw new Error(loginResult.message || 'Login failed');
    } catch (error: any) {
      set({ isAuthenticated: false, isLoading: false });
      toast.error(error?.message || 'Login failed');
      throw error;
    }
  },

  register: async (address: string, email: string, password: string, phoneNumber?: string, username?: string) => {
    try {
      set({ isLoading: true });
      const registerResult = await authService.register(address, email, password, phoneNumber ?? '', username ?? '');
      if (registerResult.success) {
        set({ isLoading: false });
        toast.success(registerResult.message || 'Register successfully. Please login.');
        return registerResult;
      }
      throw new Error(registerResult.message || 'Registration failed');
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error?.message || 'Registration failed');
      throw error;
    }
  },

  loginWithGoogle: async (idToken: string, googleInfo?: GoogleUserInfo) => {
    try {
      set({ isLoading: true });
      const loginResult = await authService.loginWithGoogle(idToken);
      if (loginResult.success) {
        try {
          const userDetails = await authService.getCurrentUser();
          set({
            userDetails,
            user: {
              id: userDetails.id,
              email: userDetails.email,
              username: userDetails.username,
              role: userDetails.role
            } as DecodedToken,
            googleInfo: googleInfo || null,
            isAuthenticated: true,
            isLoading: false
          });
          toast.success(loginResult.message || 'Google login successfully');
          return loginResult;
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      }
      throw new Error(loginResult.message || 'Google login failed');
    } catch (error: any) {
      set({ isAuthenticated: false, isLoading: false });
      toast.error(error?.message || 'Google login failed');
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        googleInfo: null,
        userDetails: null,
        isAuthenticated: false
      });
      if (queryClient) queryClient.clear();
    }
  },

  getUserInfo: async () => {
    try {
      const userInfo = await authService.getCurrentUser();
      set({ userDetails: userInfo });
      return userInfo;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  },

  initAuth: async () => {
    try {
      set({ isLoading: true });
      const userInfo = await authService.getCurrentUser();
      if (userInfo) {
        set({
          userDetails: userInfo,
          isAuthenticated: true,
          user: {
            id: userInfo.id,
            email: userInfo.email,
            role: userInfo.role,
            username: userInfo.username
          } as DecodedToken,
          isLoading: false
        });
      } else {
        set({ user: null, userDetails: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, userDetails: null, isAuthenticated: false, isLoading: false });
    }
  },

  setGoogleInfo: (info: GoogleUserInfo) => {
    set({ googleInfo: { name: info.name, email: info.email, picture: info.picture } });
  },

  clearGoogleInfo: () => set({ googleInfo: null })
}));
