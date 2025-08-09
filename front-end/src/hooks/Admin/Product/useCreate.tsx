import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductInfoInterface } from '~/types'

export const useCreate = () => {
  const initialProduct: ProductInfoInterface = {
    _id: '',
    title: '',
    price: 0,
    discountPercentage: 0,
    stock: 0,
    position: 0,
    status: 'active',
    description: '',
    featured: '1',
    thumbnail: '',
    accountFullName: '',
    createdBy: {
      account_id: '',
      createdAt: new Date()
    },
    updatedBy: [],
    productCategoryId: '',
    slug: ''
  }

  const [productInfo, setProductInfo] = useState<ProductInfoInterface>(initialProduct)
  // const [alertOpen, setAlertOpen] = useState(false)
  // const [alertMessage, setAlertMessage] = useState('')
  // const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()
  const { stateProductCategory } = useProductCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { productCategories, loading } = stateProductCategory

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = uploadImageInputRef.current?.files?.[0]
    if (file) {
      formData.set('thumbnail', file) // hoặc append nếu bạn chưa có key
    }
    const response = await fetchCreateProductAPI(formData)
    if (response.code === 201) {
      setProductInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: 'Tạo mới sản phẩm thành công!', severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000)
    }
  }

  // useEffect(() => {
  //   fetchData() // gọi API khi component mount
  // }, [fetchData])

  return {
    loading,
    productCategories,
    productInfo,
    setProductInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  }
}