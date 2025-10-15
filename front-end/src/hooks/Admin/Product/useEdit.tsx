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
  // --- Refs ---
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const colorFileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // --- State cho ảnh ---
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductDetailInterface) => {
        const product = response.product
        product.colors = product.colors || []
        product.sizes = product.sizes || []
        product.colors.forEach(color => { color.images = color.images || [] })
        setProductInfo(product)
        setThumbnailPreview(product.thumbnail) // Set preview ban đầu từ URL
      })
  }, [id])

  // --- Các hàm xử lý ảnh ---
  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Nếu có preview cũ từ ObjectURL, hãy thu hồi nó để tránh rò rỉ bộ nhớ
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview)
      }
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleAddImagesToColor = (colorIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setProductInfo(prev => {
        if (!prev) return prev
        const newColors = [...prev.colors]
        const updatedImages = (newColors[colorIndex].images || []).concat(newFiles)
        newColors[colorIndex] = { ...newColors[colorIndex], images: updatedImages }
        return { ...prev, colors: newColors }
      })
    }
  }

  const handleRemoveImageFromColor = (colorIndex: number, imageIndex: number) => {
    setProductInfo(prev => {
      if (!prev) return prev
      const newColors = [...prev.colors]
      const imageToRemove = newColors[colorIndex].images[imageIndex]
      if (imageToRemove instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(imageToRemove))
      }
      const newImages = newColors[colorIndex].images.filter((_, idx) => idx !== imageIndex)
      newColors[colorIndex] = { ...newColors[colorIndex], images: newImages }
      return { ...prev, colors: newColors }
    })
  }

  // --- Các hàm xử lý Colors & Sizes (Thêm Guard Clause) ---
  const handleAddColor = () => {
    if (currentColor.name.trim() === '') return
    setProductInfo(prev => {
      if (!prev) return prev
      return { ...prev, colors: [...prev.colors, { ...currentColor, images: [] }] }
    })
    setCurrentColor({ name: '', code: '#000000' })
  }

  const handleRemoveColor = (indexToRemove: number) => {
    setProductInfo(prev => {
      if (!prev) return prev
      return { ...prev, colors: prev.colors.filter((_, index) => index !== indexToRemove) }
    })
  }

  const handleAddSize = () => {
    if (currentSize.trim() === '' || !productInfo || productInfo.sizes.includes(currentSize.trim())) return
    setProductInfo(prev => {
      if (!prev) return prev
      return { ...prev, sizes: [...prev.sizes, currentSize.trim()] }
    })
    setCurrentSize('')
  }

  const handleRemoveSize = (indexToRemove: number) => {
    setProductInfo(prev => {
      if (!prev) return prev
      return { ...prev, sizes: prev.sizes.filter((_, index) => index !== indexToRemove) }
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!productInfo) return
    const formData = new FormData()
    const filesToUpload: File[] = []

    // Tạo payload dữ liệu từ state hiện tại
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productDataPayload = { ...productInfo, thumbnail: productInfo.thumbnail, colors: [] as any[] }

    // Xử lý thumbnail: nếu có file mới thì dùng placeholder
    if (thumbnailFile) {
      filesToUpload.push(thumbnailFile)
      productDataPayload.thumbnail = '__THUMBNAIL_PLACEHOLDER__'
    }

    // Xử lý ảnh theo màu: phân biệt ảnh cũ (string) và ảnh mới (File)
    productInfo.colors.forEach(color => {
      const colorPayload = { name: color.name, code: color.code, images: [] as string[] }
      if (color.images && Array.isArray(color.images)) {
        color.images.forEach(image => {
          if (image instanceof File) {
            filesToUpload.push(image)
            colorPayload.images.push('__IMAGE_PLACEHOLDER__')
          } else if (typeof image === 'string') {
            colorPayload.images.push(image)
          }
        })
      }
      productDataPayload.colors.push(colorPayload)
    })

    delete productDataPayload._id

    filesToUpload.forEach(file => formData.append('files', file))
    formData.append('productData', JSON.stringify(productDataPayload))
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, inputRef: React.RefObject<HTMLInputElement | null>) => {
    event.preventDefault()
    inputRef.current?.click()
  }

  return {
    allProductCategories,
    productInfo,
    setProductInfo,
    uploadImageInputRef,
    handleSubmit,
    handleClick,
    role,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    handleAddColor,
    handleRemoveColor,
    handleAddSize,
    handleRemoveSize,
    colorFileInputRefs,
    thumbnailPreview,
    handleThumbnailChange,
    handleAddImagesToColor,
    handleRemoveImageFromColor
  }
}