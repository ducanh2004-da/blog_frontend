import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, redirect, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { PageSkeleton } from '@/components/common/layouts/PageSkeleton';
import { MainLayout, AuthLayout, ErrorBoundary } from '../layouts';

// Lazy pages
const Pages = {
  Main: {
    Home: lazy(() => import('../pages/Home')),
    ViewDetail: lazy(() => import('../pages/ViewBlog')),
    Profile: lazy(() => import('../pages/UserDetail')),
    AIChatbot: lazy(() => import('../pages/AIChatbot'))
  },
  Auth: {
    Login: lazy(() => import('../pages/Login')),
    Register: lazy(() => import('../pages/Register')),
  },
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userDetails = useAuthStore(state => state.userDetails)
  const isAuthInitialized = useAuthStore(state => state.isAuthInitialized)
  
  if (!isAuthInitialized) {
    return <PageSkeleton />
  }
  
  if (!userDetails) {
    return <Navigate to="/auth/login" replace />
  }
  
  return <>{children}</>
}

// Auth Route Component (redirect nếu đã đăng nhập)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isAuthInitialized = useAuthStore(state => state.isAuthInitialized) // <-- DÙNG STATE MỚI

  // Đang check ngầm -> Khóa tạm form Login/Register
  if (!isAuthInitialized) {
    return <PageSkeleton />
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

//Hiển thị loading UI trong lúc tải component
const withSuspense = (Element: any) => (
  <Suspense fallback={<PageSkeleton />}>{Element}</Suspense>
)

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
       { path: "viewDetail/:blogId", element: withSuspense(<Pages.Main.ViewDetail />) },
       {path: "profile", element: withSuspense(<ProtectedRoute><Pages.Main.Profile /></ProtectedRoute>)},
       {path: "ai", element: withSuspense(<Pages.Main.AIChatbot />)}
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { 
        path: 'login', 
        element: withSuspense(
          <AuthRoute>
            <Pages.Auth.Login />
          </AuthRoute>
        )
      },
      { 
        path: 'signup', 
        element: withSuspense(
          <AuthRoute>
            <Pages.Auth.Register />
          </AuthRoute>
        )
      },
    ],
    errorElement: <ErrorBoundary />,
  },
]);