/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import type { Brand } from '~/types/brand.type'

interface ApiResponse {
  code: number
  message: string
  [key: string]: any
}

// API lấy tất cả thương hiệu (phân trang)
export const fetchAllBrandsAPI = async (page = 1, keyword = ''): Promise<ApiResponse & { brands: Brand[], pagination: any }> => {
  const response = await axios.get(`${API_ROOT}/admin/brands?page=${page}&keyword=${keyword}`, { withCredentials: true })
  return response.data
}

// API tạo mới (dùng FormData)
export const createBrandAPI = async (formData: FormData): Promise<ApiResponse & { data: Brand }> => {
  const response = await axios.post(`${API_ROOT}/admin/brands/create`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  })
  return response.data
}

// API lấy chi tiết
export const fetchBrandDetailAPI = async (id: string): Promise<ApiResponse & { brand: Brand }> => {
  const response = await axios.get(`${API_ROOT}/admin/brands/detail/${id}`, { withCredentials: true })
  return response.data
}

// API cập nhật (dùng FormData)
export const updateBrandAPI = async (id: string, formData: FormData): Promise<ApiResponse> => {
  const response = await axios.patch(`${API_ROOT}/admin/brands/edit/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  })
  return response.data
}

// API xóa
export const deleteBrandAPI = async (id: string): Promise<ApiResponse> => {
  const response = await axios.delete(`${API_ROOT}/admin/brands/delete/${id}`, { withCredentials: true })
  return response.data
}
