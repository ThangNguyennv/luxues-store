/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenManager } from '~/utils/tokenManager'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 seconds
  withCredentials: true // Gửi kèm cookie trong các yêu cầu
})

// Biến để tránh gọi refresh nhiều lần đồng thời
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, accessToken: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(accessToken)
    }
  })
  failedQueue = []
}

// REQUEST INTERCEPTOR - Tự động thêm Access Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenManager.getAccessToken()

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}` // TỰ ĐỘNG THÊM TOKEN
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR - Auto Refresh Token
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check nếu là endpoint refresh hoặc login → không retry
      if (
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        tokenManager.clearAccessToken()
        window.location.href = '/admin/auth/login'
        return Promise.reject(error)
      }

      // Nếu đang refresh → đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((accessToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // GỌI API REFRESH TOKEN
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/auth/refresh-token`,
          {}, // Body rỗng vì refresh token ở cookie
          { withCredentials: true } // GỬI COOKIE
        )

        const { accessToken } = response.data

        if (accessToken) {
          // Lưu access token mới
          tokenManager.setAccessToken(accessToken)

          // Process các request đang chờ
          processQueue(null, accessToken)

          // Retry request ban đầu
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh thất bại → Logout
        processQueue(refreshError, null)
        tokenManager.clearAccessToken()
        window.location.href = '/admin/auth/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
