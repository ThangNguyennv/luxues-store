import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchRelatedProductsAPI  } from '~/apis/client/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useCart } from '~/contexts/client/CartContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types/product.type'
import Skeleton from '@mui/material/Skeleton'
import { FaStar, FaRegStar } from 'react-icons/fa6' // Import thêm icon
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode, Thumbs } from 'swiper/modules'
import ProductCard from '~/components/client/ProductCard/ProductCard'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'

const DetailProductClient = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  // === CẬP NHẬT STATE CHO MÀU SẮC VÀ ẢNH HIỂN THỊ ===
  const [selectedColor, setSelectedColor] = useState<ProductInfoInterface['colors'][0] | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState<string | File>('') // State cho ảnh chính

  const params = useParams()
  const slugProduct = params.slugProduct as string
  const { dispatchAlert } = useAlertContext()
  const { addToCart } = useCart()
  const [relatedProducts, setRelatedProducts] = useState<ProductInfoInterface[]>([])
  useEffect(() => {
    if (!slugProduct) return
    setLoading(true)
    fetchDetailProductAPI(slugProduct)
      .then((response: ProductDetailInterface) => {
        const product = response.product
        product.colors = product.colors || []
        product.sizes = product.sizes || []
        // Đảm bảo mỗi màu đều có mảng images
        product.colors.forEach(color => color.images = color.images || [])
        setProductDetail(product)

        if (product.colors.length > 0) {
          const initialColor = product.colors[0]
          setSelectedColor(initialColor)
          if (initialColor.images.length > 0) {
            setMainImage(initialColor.images[0])
          } else {
            setMainImage(product.thumbnail)
          }
        } else {
          setMainImage(product.thumbnail)
        }
        if (product.sizes.length > 0) {
          setSelectedSize(product.sizes[0])
        }
      })
      .finally(() => setLoading(false))

  }, [slugProduct])

  useEffect(() => {
    // Chỉ chạy khi đã có thông tin sản phẩm chính
    if (productDetail && productDetail._id) {
      const getRelated = async () => {
        try {
          const res = await fetchRelatedProductsAPI(productDetail._id ?? '')
          setRelatedProducts(res.products)
        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm liên quan:', error)
        }
      }
      getRelated()
    }
  }, [productDetail])

  // === HÀM XỬ LÝ KHI CHỌN MÀU MỚI ===
  const handleColorSelect = (color: ProductInfoInterface['colors'][0]) => {
    setSelectedColor(color)
    if (color.images && color.images.length > 0) {
      setMainImage(color.images[0])
    }
  }
  const handleQuantityChange = (amount: number) => {
    if (!productDetail) return
    const newQuantity = quantity + amount
    if (newQuantity >= 1 && newQuantity <= productDetail.stock) {
      setQuantity(newQuantity)
    }
  }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productDetail) return

    // Kiểm tra xem người dùng đã chọn màu/size chưa (nếu sản phẩm có)
    if (productDetail.colors.length > 0 && !selectedColor) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn màu sắc', severity: 'error' } })
      return
    }
    if (productDetail.sizes.length > 0 && !selectedSize) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn kích cỡ', severity: 'error' } })
      return
    }

    try {
      await addToCart(productDetail._id ?? '', quantity, selectedColor?.name, selectedSize)
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Đã thêm vào giỏ hàng', severity: 'success' } })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Lỗi khi thêm vào giỏ', severity: 'error' } })
    }
  }

  // Giao diện khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="container mx-auto my-12 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div><Skeleton variant="rectangular" width="100%" height={530} /></div>
          <div className="flex flex-col gap-6">
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={100} />
            <Skeleton variant="rectangular" width="50%" height={50} />
          </div>
        </div>
      </div>
    )
  }

  if (!productDetail) {
    return <div className='text-center my-20'>Không tìm thấy sản phẩm.</div>
  }

  return (
    <div className="container mx-auto mt-12 mb-[150px] px-4">
      {/* Breadcrumb */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* === CỘT TRÁI: GALLERY ẢNH === */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* SLIDER THUMBNAILS DỌC */}
          <div className="flex-shrink-0 sm:h-[530px] w-full sm:w-24">
            <Swiper
              direction={'vertical'}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              navigation={true}
              modules={[Navigation, FreeMode, Thumbs]}
              className="h-full w-full vertical-swiper"
            >
              {(selectedColor?.images ?? [productDetail.thumbnail]).map((image, index) => (
                <SwiperSlide key={index} onClick={() => setMainImage(image)} className="cursor-pointer">
                  <div className={`p-1 border-2 rounded-lg transition-all ${mainImage === image ? 'border-black' : 'border-transparent'}`}>
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ẢNH CHÍNH */}
          <div className="flex-1 flex justify-center items-start">
            <img
              src={typeof mainImage === 'string' ? mainImage : URL.createObjectURL(mainImage)}
              alt={productDetail.title}
              className='w-full max-w-[480px] h-auto object-cover rounded-lg'
            />
          </div>
        </div>

        {/* === CỘT PHẢI: THÔNG TIN VÀ LỰA CHỌN === */}
        <div className='flex flex-col gap-5'>
          <h1 className='font-bold text-4xl text-gray-800'>{productDetail.title}</h1>
          {/* Đánh giá sao */}
          {productDetail.stars && (
            <div className="flex items-center gap-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                i < Math.round(productDetail.stars.average) ? <FaStar key={i}/> : <FaRegStar key={i}/>
              ))}
              <span className="text-gray-600 text-sm ml-2">({productDetail.stars.count} đánh giá)</span>
            </div>
          )}

          {/* Giá sản phẩm */}
          <div className='flex items-baseline gap-4 bg-gray-50 p-4 rounded-lg'>
            <span className="font-bold text-3xl text-red-600">
              {Math.floor(((productDetail.price * (100 - productDetail.discountPercentage)) / 100)).toLocaleString('vi-VN')}đ
            </span>
            {productDetail.discountPercentage > 0 && (
              <>
                <span className='line-through text-gray-400 text-xl'>{(productDetail.price).toLocaleString('vi-VN')}đ</span>
                <span className="text-red-600 font-semibold px-2 py-1 bg-red-100 rounded-md text-sm">-{productDetail.discountPercentage}%</span>
              </>
            )}
          </div>

          {/* Lựa chọn màu sắc */}
          {productDetail.colors.length > 0 && (
            <div className='flex flex-col gap-3 pt-4 border-t'>
              <h3 className='font-semibold text-gray-600'>Chọn màu sắc</h3>
              <div className='flex flex-wrap gap-3'>
                {productDetail.colors.map((color) => (
                  <button key={color.name} type="button" onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-full border-2 p-1 flex justify-center items-center transition-all ${selectedColor?.name === color.name ? 'border-black' : 'border-gray-300'}`}
                    title={color.name}
                  >
                    <span className="block w-full h-full rounded-full" style={{ backgroundColor: color.code }}></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lựa chọn kích cỡ */}
          {productDetail.sizes.length > 0 && (
            <div className='flex flex-col gap-3 pt-4 border-t'>
              <h3 className='font-semibold text-gray-600'>Chọn kích cỡ</h3>
              <div className='flex flex-wrap gap-3'>
                {productDetail.sizes.map((size) => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)}
                    className={`border px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form thêm vào giỏ */}
          <form onSubmit={handleSubmit} className='flex items-center gap-4 pt-4 border-t'>
            {/* Input số lượng */}
            <div className="flex items-center border rounded-full bg-gray-100 font-bold">
              <button type="button" onClick={() => handleQuantityChange(-1)} className="px-5 py-3 text-lg">-</button>
              <input
                className='w-14 h-full text-center bg-transparent outline-none'
                type='number' value={quantity} readOnly
              />
              <button type="button" onClick={() => handleQuantityChange(1)} className="px-5 py-3 text-lg">+</button>
            </div>
            {/* Nút thêm vào giỏ */}
            <button
              type='submit'
              className='flex-1 bg-black text-white font-bold py-4 px-6 rounded-full hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400'
              disabled={productDetail.stock === 0}
            >
              {productDetail.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </button>
          </form>

        </div>
      </div>

      {/* Phần mô tả chi tiết */}
      <div className='mt-20 pt-8 border-t'>
        <h2 className='text-2xl font-bold mb-4'>Mô tả sản phẩm</h2>
        <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: productDetail.description }} />
      </div>

      {/* Phần đánh giá sản phẩm */}
      <div className='mt-20 pt-8 border-t'>
        <h2 className='text-2xl font-bold mb-4'>Đánh giá sản phẩm</h2>
      </div>

      {/* === PHẦN SẢN PHẨM CÙNG LOẠI === */}
      {relatedProducts.length > 0 && (
        <div className='mt-20 pt-8 border-t'>
          <h2 className='text-3xl font-bold mb-6 text-center'>Sản phẩm cùng loại</h2>
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={4}
            navigation
            breakpoints={{
              // Responsive: 1 slide trên mobile, 2 trên tablet, 4 trên desktop
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 30 }
            }}
            className="related-products-swiper"
          >
            {relatedProducts.map(product => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}

export default DetailProductClient