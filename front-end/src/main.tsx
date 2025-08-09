import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.ts'
import { ThemeProvider } from '@emotion/react'
import { ProductCategoryProvider } from './contexts/admin/ProductCategoryContext.tsx'
import { AlertProvider } from './contexts/admin/AlertContext.tsx'
import { AlertToast } from './components/alert/Alert.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <AlertProvider>
      <ProductCategoryProvider>
        <CssBaseline />
        <App />
        <AlertToast />
      </ProductCategoryProvider>
    </AlertProvider>
  </ThemeProvider>
)
