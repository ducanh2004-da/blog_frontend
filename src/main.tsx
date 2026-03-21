import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { queryClient } from './configs/query-client.config.ts'
import reactArrayToTree from 'react-array-to-tree'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

registerSW()

const isProduction = import.meta.env.PROD || 'production'

if (!isProduction && typeof window !== 'undefined') {
  import('react-scan').then(({ scan }) => {
    scan({
      enabled: true
    })
  }).catch(err => {
    console.error('Failed to load react-scan:', err)
  })
}

const Provider = reactArrayToTree([
  <GoogleOAuthProvider key="google-oauth" clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>{null}</GoogleOAuthProvider>,
  <QueryClientProvider key="query-client" client={queryClient}>{null}</QueryClientProvider>,
  <AuthProvider key="auth">{null}</AuthProvider>
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </Provider>
  </React.StrictMode>
)