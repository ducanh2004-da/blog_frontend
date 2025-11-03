import React, { lazy } from 'react';
import { createBrowserRouter, redirect, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

import { MainLayout, AuthLayout, ErrorBoundary } from '../layouts';

// Lazy pages
const Pages = {
  Main: {
    Home: lazy(() => import('../pages/Home')),
  },
  Auth: {
    Login: lazy(() => import('../pages/Login')),
    Register: lazy(() => import('../pages/Register')),
  },
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  
  return <>{children}</>
}

// Auth Route Component (redirect nếu đã đăng nhập)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { 
        index: true, 
        element: (
            <Pages.Main.Home />
        )
      },
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { 
        path: 'login', 
        element: (
          <AuthRoute>
            <Pages.Auth.Login />
          </AuthRoute>
        )
      },
      { 
        path: 'signup', 
        element: (
          <AuthRoute>
            <Pages.Auth.Register />
          </AuthRoute>
        )
      },
    ],
    errorElement: <ErrorBoundary />,
  },
]);