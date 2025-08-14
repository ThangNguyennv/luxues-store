import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI, fetchEditProductCategoryAPI } from '~/apis/admin/productCategory.api'
import { useAlertContext } from '~/contexts/admin/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductCategoryDetailInterface, ProductCategoryInfoInterface } from '~/types/productCategory.type'

export const useEdit = () => {
  const [productCategoryInfo, setProductCategoryInfo] = useState<ProductCategoryInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailProductCategoryAPI(id)
      .then((response: ProductCategoryDetailInterface) => {
        setProductCategoryInfo(response.productCategory)
      })
  }, [id])

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
    if (!productCategoryInfo) return

    const formData = new FormData(event.currentTarget)
    formData.set('title', productCategoryInfo.title)
    formData.set('description', productCategoryInfo.description)
    formData.set('position', productCategoryInfo.position.toString())

    const response = await fetchEditProductCategoryAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/products-category/detail/${id}`)
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