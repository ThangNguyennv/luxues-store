import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateProductAPI } from '~/apis/admin/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useProductCategoryContext } from '~/contexts/admin/ProductCategoryContext'
import type { ProductInfoInterface } from '~/types/product.type'
import { useAuth } from '~/contexts/admin/AuthContext'

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
    updatedAt: null,
    colors: [],
    sizes: [],
    stars: {
      average: 0,
      count: 0
    }
  }

  const [productInfo, setProductInfo] = useState<ProductInfoInterface>(initialProduct)
  const { stateProductCategory } = useProductCategoryContext()
  const { allProductCategories } = stateProductCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [currentColor, setCurrentColor] = useState({ name: '', code: '#000000' })
  const [currentSize, setCurrentSize] = useState('')

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null) // Ref cho thumbnail
  // Tạo một mảng ref để quản lý các input file của từng màu
  const colorFileInputRefs = useRef<(HTMLInputElement | null)[]>([])


  // State chỉ để lưu file và URL preview, không lưu trực tiếp vào productInfo
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // Hàm xử lý ảnh đại diện
  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview) // Giải phóng bộ nhớ
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  // Hàm xử lý thêm ảnh cho một màu cụ thể
  const handleAddImagesToColor = (colorIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setProductInfo(prev => {
        const newColors = [...prev.colors]
        // Lưu trữ File object trực tiếp vào mảng images của màu đó
        const updatedImages = (newColors[colorIndex].images || []).concat(newFiles)
        newColors[colorIndex] = { ...newColors[colorIndex], images: updatedImages }
        return { ...prev, colors: newColors }
      })
    }
  }

  // Hàm xóa một ảnh khỏi gallery của một màu
  const handleRemoveImageFromColor = (colorIndex: number, imageIndex: number) => {
    setProductInfo(prev => {
      const newColors = [...prev.colors]
      const imageToRemove = newColors[colorIndex].images[imageIndex]
      // Nếu là File, giải phóng bộ nhớ
      if (imageToRemove instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(imageToRemove))
      }
      const newImages = newColors[colorIndex].images.filter((_, idx) => idx !== imageIndex)
      newColors[colorIndex] = { ...newColors[colorIndex], images: newImages }
      return { ...prev, colors: newColors }
    })
  }

  // --- Logic cho Colors ---
  const handleAddColor = () => {
    if (currentColor.name.trim() === '') return
    setProductInfo(prev => ({
      ...prev,
      // Khi thêm màu mới, khởi tạo mảng images là mảng rỗng
      colors: [...prev.colors, { ...currentColor, images: [] }]
    }))
    setCurrentColor({ name: '', code: '#000000' })
  }

  const handleRemoveColor = (indexToRemove: number) => {
    setProductInfo(prev => ({
      ...prev,
      colors: prev.colors.filter((_, index) => index !== indexToRemove)
    }))
  }

  // --- Logic cho Sizes ---
  const handleAddSize = () => {
    if (currentSize.trim() === '' || productInfo.sizes.includes(currentSize.trim())) return // Không thêm nếu rỗng hoặc đã tồn tại
    setProductInfo(prev => ({
      ...prev,
      sizes: [...prev.sizes, currentSize.trim()]
    }))
    // Reset input
    setCurrentSize('')
  }

  const handleRemoveSize = (indexToRemove: number) => {
    setProductInfo(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData()
    // 1. Chuẩn bị dữ liệu và tập hợp các file cần upload
    const filesToUpload: File[] = []

    // Tạo một bản sao sạch của productInfo để gửi đi, đảm bảo nhất quán
    const productDataPayload = {
      ...productInfo,
      thumbnail: '', // Tạm thời xóa, sẽ được thay thế bằng placeholder
      colors: [] as { name: string; code: string; images: string[] }[]
    }
    delete productDataPayload._id
    // Xử lý ảnh đại diện
    if (thumbnailFile) {
      filesToUpload.push(thumbnailFile)
      // Dùng placeholder để backend biết vị trí của thumbnail trong mảng files
      productDataPayload.thumbnail = '__THUMBNAIL_PLACEHOLDER__'
    }

    // Xử lý ảnh theo từng màu
    productInfo.colors.forEach(color => {
      const colorPayload = { name: color.name, code: color.code, images: [] as string[] }
      if (color.images && Array.isArray(color.images)) {
        (color.images).forEach(image => {
          if (image instanceof File) {
            filesToUpload.push(image)
            // Dùng placeholder để backend biết ảnh này thuộc về màu nào
            colorPayload.images.push('__IMAGE_PLACEHOLDER__')
          }
        })
      }
      productDataPayload.colors.push(colorPayload)
    })

    // 2. Gắn dữ liệu vào FormData
    // Gắn tất cả các file ảnh vào MỘT trường duy nhất là 'files'
    filesToUpload.forEach(file => {
      formData.append('files', file)
    })
    // Gắn tất cả các thông tin còn lại vào MỘT trường 'productData' dưới dạng JSON
    formData.append('productData', JSON.stringify(productDataPayload))

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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, inputRef: React.RefObject<HTMLInputElement | null>) => {
    event.preventDefault()
    inputRef.current?.click()
  }


  return {
    allProductCategories,
    productInfo,
    setProductInfo,
    uploadImageInputRef,
    colorFileInputRefs, // Trả về mảng ref
    handleSubmit,
    role,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    handleAddColor,
    handleRemoveColor,
    handleAddSize,
    handleRemoveSize,
    thumbnailPreview,
    handleThumbnailChange,
    handleAddImagesToColor,
    handleRemoveImageFromColor,
    // Sửa lại handleClick để nhận ref
    handleClick
  }
}