import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchEditProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types/product.type'

export const useEdit = () => {
  const [productInfo, setProductInfo] = useState<ProductInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductDetailInterface) => {
        setProductInfo(response.product)
      })
  }, [id])

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
    if (!productInfo) return
    const formData = new FormData(event.currentTarget)
    formData.set('title', productInfo.title)
    formData.set('featured', productInfo.featured)
    formData.set('description', productInfo.description)
    formData.set('price', productInfo.price.toString())
    formData.set('discountPercentage', productInfo.discountPercentage.toString())
    formData.set('stock', productInfo.stock.toString())
    formData.set('position', productInfo.position.toString())

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
    preview
  }
}