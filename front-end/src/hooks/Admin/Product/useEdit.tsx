import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchEditProductAPI } from '~/apis/admin/product.api'
import type { ProductDetailInterface, ProductInterface } from '~/components/Admin/Types/Interface'

export const useEdit = () => {
  const [productInfo, setProductInfo] = useState<ProductDetailInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductInterface) => {
        setProductInfo(response.product)
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
      setAlertMessage('Đã cập nhật thành công sản phẩm!')
      setAlertSeverity('success')
      setAlertOpen(true)
      setTimeout(() => {
        navigate(`/admin/products/detail/${id}`)
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