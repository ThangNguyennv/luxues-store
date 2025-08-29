import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductInfoInterface } from '~/types/product.type'

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
    updatedAt: null
  }

  const [productInfo, setProductInfo] = useState<ProductInfoInterface>(initialProduct)
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = uploadImageInputRef.current?.files?.[0]
    if (file) {
      formData.set('thumbnail', file)
    }
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
    handleClick
  }
}