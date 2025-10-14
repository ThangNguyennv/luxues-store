import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductInfoInterface } from '~/types/product.type'
import { useAuth } from '~/contexts/admin/AuthContext'

export const useCreate = () => {
  const initialProduct: ProductInfoInterface = {
    _id: '',
    title: '',
    price: 0,
    discountPercentage: 0,
    stock: 0,
    position: '',
    status: 'active',
    description: '',
    featured: '1',
    thumbnail: '',
    accountFullName: '',
    createdBy: {
      account_id: ''
      // createdAt: null
    },
    updatedBy: [],
    product_category_id: '',
    createdAt: null,
    updatedAt: null,
    colors: [],
    sizes: []
  }

  const [productInfo, setProductInfo] = useState<ProductInfoInterface>(initialProduct)
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [currentColor, setCurrentColor] = useState({ name: '', code: '#000000' })
  const [currentSize, setCurrentSize] = useState('')
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  // const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
    }
  }

  // --- Logic cho Colors ---
  const handleAddColor = () => {
    if (currentColor.name.trim() === '') return // Không thêm nếu tên màu rỗng
    setProductInfo(prev => ({
      ...prev,
      colors: [...prev.colors, currentColor]
    }))
    // Reset input
    setCurrentColor({ name: '', code: '#000000' })
  }

  const handleRemoveColor = (indexToRemove: number) => {
    setProductInfo(prev => ({
      ...prev,
      colors: prev.colors.filter((_, index) => index !== indexToRemove)
    }))
  }

  // --- Logic cho Sizes ---
  const handleAddSize = () => {
    if (currentSize.trim() === '' || productInfo.sizes.includes(currentSize.trim())) return // Không thêm nếu rỗng hoặc đã tồn tại
    setProductInfo(prev => ({
      ...prev,
      sizes: [...prev.sizes, currentSize.trim()]
    }))
    // Reset input
    setCurrentSize('')
  }

  const handleRemoveSize = (indexToRemove: number) => {
    setProductInfo(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, index) => index !== indexToRemove)
    }))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = uploadImageInputRef.current?.files?.[0]
    if (file) {
      formData.set('thumbnail', file)
    }
    // === CHUẨN HÓA DỮ LIỆU MẢNG TRƯỚC KHI GỬI ===
    // FormData không gửi trực tiếp được mảng object, cần chuyển thành chuỗi JSON
    formData.append('colors', JSON.stringify(productInfo.colors))
    formData.append('sizes', JSON.stringify(productInfo.sizes))
    const response = await fetchCreateProductAPI(formData)
    if (response.code === 201) {
      setProductInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000)
    }
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    allProductCategories,
    productInfo,
    setProductInfo,
    uploadImageInputRef,
    handleChange,
    handleSubmit,
    preview,
    handleClick,
    role,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    handleAddColor,
    handleRemoveColor,
    handleAddSize,
    handleRemoveSize
  }
}