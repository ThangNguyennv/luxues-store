import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import type { ProductDetailInterface } from '~/components/Admin/Types/Interface'

export const useCreate = () => {
  const initialProduct: ProductDetailInterface = {
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
    accountFullName: ''
  }
  const [productInfo, setProductInfo] = useState<ProductDetailInterface>(initialProduct)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()

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
      setAlertMessage('Đã tạo thành công sản phẩm!')
      setAlertSeverity('success')
      setAlertOpen(true)
      setTimeout(() => {
        navigate('/admin/products')
      }, 2000)
    }
  }
  return {
    productInfo,
    setProductInfo,
    alertOpen,
    setAlertOpen,
    alertMessage,
    alertSeverity,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  }
}