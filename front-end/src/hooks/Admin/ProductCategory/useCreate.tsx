import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductCategoryInfoInterface } from '~/types/productCategory.type'

export const useCreate = () => {
  const initialProductCategory: ProductCategoryInfoInterface = {
    _id: '',
    title: '',
    position: '',
    status: 'active',
    description: '',
    thumbnail: '',
    createdBy: {
      account_id: ''
    },
    updatedBy: [],
    children: [],
    slug: '',
    parent_id: '',
    createdAt: null,
    updatedAt: null
  }

  const [productCategoryInfo, setProductCategoryInfo] = useState<ProductCategoryInfoInterface>(initialProductCategory)
  const { stateProductCategory } = useProductCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allProductCategories } = stateProductCategory

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
    formData.append('description', productCategoryInfo.description)
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    allProductCategories,
    productCategoryInfo,
    setProductCategoryInfo,
    uploadImageInputRef,
    preview,
    handleChange,
    handleSubmit,
    handleClick
  }
}