/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface BrandCategory extends GeneralInfoInterface {
 parent_id?: string
 description?: string
 children?: BrandCategory[] // Dùng để tạo cây (tree)
}

export interface BrandCategoriesResponseInterface {
 code: number
 message: string
 categories: BrandCategory[]
}

export interface Brand extends GeneralInfoInterface {
 description?: string
 brand_category_id?: string
}

// --- Brand Group (Dữ liệu trả về từ API Client) ---
// Đây là kiểu dữ liệu mà aggregation pipeline trong brand.controller.ts trả về
export interface BrandGroup {
  categoryTitle: string;
  categorySlug?: string;
  brands: Brand[];
}

export interface BrandsClientResponseInterface {
 code: number
 message: string
 data: BrandGroup[]
}

export interface BrandsAdminResponseInterface {
 code: number
 message: string
 brands: Brand[]
 pagination?: any
}

export interface BrandStates extends HelperInterface, ParamsInterface {
 brands: Brand[]
}

export type BrandActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<BrandStates> }
  | { type: 'RESET' }

