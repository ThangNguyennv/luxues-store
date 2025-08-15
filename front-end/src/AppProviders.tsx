import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { AlertProvider } from './contexts/alert/AlertContext'
import { AuthProvider } from './contexts/admin/AuthContext'
import { ProductCategoryProvider } from './contexts/admin/ProductCategoryContext'
import { ProductProvider } from './contexts/admin/ProductContext'
import { composeProviders } from './composeProviders'
import { ArticleProvider } from './contexts/admin/ArticleContext'
import { ArticleCategoryProvider } from './contexts/admin/ArticleCategory'

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

// Gom tất cả provider thành 1 (Nhớ viết từ trên xuống để khi chạy nó sẽ chạy từ children -> từ dưới lên trên)
export const AppProviders = composeProviders(
  ThemeProviderWrapper,
  AlertProvider,
  AuthProvider,
  ProductCategoryProvider,
  ProductProvider,
  ArticleProvider,
  ArticleCategoryProvider
)
