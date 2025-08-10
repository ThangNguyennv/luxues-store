/* eslint-disable react-refresh/only-export-components */
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.ts'
import { ThemeProvider } from '@emotion/react'
import { ProductCategoryProvider } from './contexts/admin/ProductCategoryContext.tsx'
import { AlertProvider } from './contexts/admin/AlertContext.tsx'
import { AlertToast } from './components/alert/Alert.tsx'
import { ProductProvider } from './contexts/admin/ProductContext.tsx'
import { AuthProvider } from './contexts/admin/AuthContext.tsx'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <AuthProvider>
          <ProductCategoryProvider>
            <ProductProvider>
              {children}
            </ProductProvider>
          </ProductCategoryProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <Providers>
    <CssBaseline />
    <App />
    <AlertToast />
  </Providers>
)
