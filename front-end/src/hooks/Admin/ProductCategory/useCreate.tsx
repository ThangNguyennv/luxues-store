import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductCategoryInfoInterface } from '~/types'

export const useCreate = () => {
  const initialProductCategory: ProductCategoryInfoInterface = {
    _id: '',
    title: '',
    position: 0,
    status: 'active',
    description: '',
    thumbnail: '',
    createdBy: {
      account_id: '',
      createdAt: new Date()
    },
    updatedBy: [],
    children: [],
    slug: '',
    parent_id: ''
  }

  const [productCategoryInfo, setProductCategoryInfo] = useState<ProductCategoryInfoInterface>(initialProductCategory)
  const { stateProductCategory } = useProductCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allProductCategories } = stateProductCategory

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
    const response = await fetchCreateProductCategoryAPI(formData)
    if (response.code === 201) {
      setProductCategoryInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/products-category')
      }, 2000)
    }
  }
  return {
    allProductCategories,
    productCategoryInfo,
    setProductCategoryInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  }
}