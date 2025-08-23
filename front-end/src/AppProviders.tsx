import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { AlertProvider } from './contexts/alert/AlertContext'
import { AuthAdminProvider } from './contexts/admin/AuthContext'
import { ProductCategoryProvider } from './contexts/admin/ProductCategoryContext'
import { ProductProvider } from './contexts/admin/ProductContext'
import { composeProviders } from './composeProviders'
import { ArticleProvider } from './contexts/admin/ArticleContext'
import { ArticleCategoryProvider } from './contexts/admin/ArticleCategory'
import { AuthClientProvider } from './contexts/client/AuthContext'
import { SettingGeneralProvider } from './contexts/client/SettingGeneralContext'

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

// Gom tất cả provider thành 1 (Nhớ viết từ trên xuống để khi chạy nó sẽ chạy từ children -> từ dưới lên trên)
export const AppProviders = composeProviders(
  ThemeProviderWrapper,
  AlertProvider,
  AuthAdminProvider,
  AuthClientProvider,
  SettingGeneralProvider,
  ProductCategoryProvider,
  ProductProvider,
  ArticleProvider,
  ArticleCategoryProvider
)
