import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchEditProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types/product.type'
import { useAuth } from '~/contexts/admin/AuthContext'

export const useEdit = () => {
  const [productInfo, setProductInfo] = useState<ProductInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [currentColor, setCurrentColor] = useState({ name: '', code: '#000000' })
  const [currentSize, setCurrentSize] = useState('')

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductDetailInterface) => {
        response.product.colors = response.product.colors || []
        response.product.sizes = response.product.sizes || []
        setProductInfo(response.product)
      })
  }, [id])

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)

  // --- Logic cho Colors ---
  const handleAddColor = () => {
    if (currentColor.name.trim() === '' || !productInfo) return
    setProductInfo({
      ...productInfo,
      colors: [...productInfo.colors, currentColor]
    })
    setCurrentColor({ name: '', code: '#000000' }) // Reset input
  }

  const handleRemoveColor = (indexToRemove: number) => {
    if (!productInfo) return
    setProductInfo({
      ...productInfo,
      colors: productInfo.colors.filter((_, index) => index !== indexToRemove)
    })
  }

  // --- Logic cho Sizes ---
  const handleAddSize = () => {
    if (currentSize.trim() === '' || !productInfo || productInfo.sizes.includes(currentSize.trim())) return
    setProductInfo({
      ...productInfo,
      sizes: [...productInfo.sizes, currentSize.trim()]
    })
    setCurrentSize('') // Reset input
  }

  const handleRemoveSize = (indexToRemove: number) => {
    if (!productInfo) return
    setProductInfo({
      ...productInfo,
      sizes: productInfo.sizes.filter((_, index) => index !== indexToRemove)
    })
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!productInfo) return
    const formData = new FormData(event.currentTarget)
    formData.set('title', productInfo.title)
    formData.set('featured', productInfo.featured)
    formData.set('description', productInfo.description)
    formData.set('price', productInfo.price.toString())
    formData.set('discountPercentage', productInfo.discountPercentage.toString())
    formData.set('stock', productInfo.stock.toString())
    formData.set('position', productInfo.position.toString())
    // === CHUẨN HÓA DỮ LIỆU MẢNG TRƯỚC KHI GỬI ===
    // Chuyển mảng object/string thành chuỗi JSON
    formData.set('colors', JSON.stringify(productInfo.colors))
    formData.set('sizes', JSON.stringify(productInfo.sizes))
    const response = await fetchEditProductAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/products/detail/${id}`)
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
    handleClick,
    uploadImagePreviewRef,
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