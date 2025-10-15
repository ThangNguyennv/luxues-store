import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis/client/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useCart } from '~/contexts/client/CartContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types/product.type'
import Skeleton from '@mui/material/Skeleton'
import { FaStar, FaRegStar, FaCheck } from 'react-icons/fa6' // Import thêm icon

const DetailProductClient = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  // === THÊM STATE ĐỂ LƯU LỰA CHỌN CỦA NGƯỜI DÙNG ===
  const [selectedColor, setSelectedColor] = useState<{ name: string; code: string } | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const params = useParams()
  const slugProduct = params.slugProduct as string
  const { dispatchAlert } = useAlertContext()
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slugProduct) return
    setLoading(true)
    fetchDetailProductAPI(slugProduct)
      .then((response: ProductDetailInterface) => {
        // Đảm bảo colors và sizes luôn là mảng để tránh lỗi
        response.product.colors = response.product.colors || []
        response.product.sizes = response.product.sizes || []
        setProductDetail(response.product)
        // Tự động chọn màu và size đầu tiên nếu có
        if (response.product.colors.length > 0) {
          setSelectedColor(response.product.colors[0])
        }
        if (response.product.sizes.length > 0) {
          setSelectedSize(response.product.sizes[0])
        }
      })
      .finally(() => setLoading(false))
  }, [slugProduct])

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
      await addToCart(productDetail._id, quantity, selectedColor?.name, selectedSize)
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
    <div className="container mx-auto my-12 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* === CỘT TRÁI: HÌNH ẢNH === */}
        <div className='flex flex-col items-center'>
          <img
            src={productDetail.thumbnail}
            alt={productDetail.title}
            className='w-full max-w-[480px] h-auto object-cover rounded-lg shadow-lg'
          />
          {/* Bạn có thể thêm một gallery ảnh nhỏ ở đây */}
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
            <div className='flex flex-col gap-3'>
              <h3 className='font-semibold text-lg'>Màu sắc: <span className='font-bold'>{selectedColor?.name}</span></h3>
              <div className='flex flex-wrap gap-3'>
                {productDetail.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 transform hover:scale-110 ${selectedColor?.name === color.name ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && <FaCheck className="text-white mx-auto" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lựa chọn kích cỡ */}
          {productDetail.sizes.length > 0 && (
            <div className='flex flex-col gap-3'>
              <h3 className='font-semibold text-lg'>Kích cỡ:</h3>
              <div className='flex flex-wrap gap-3'>
                {productDetail.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black hover:bg-gray-100'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form thêm vào giỏ */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
            <div className='flex items-center gap-4'>
              <h3 className='font-semibold text-lg'>Số lượng:</h3>
              <div className="flex items-center border rounded-lg">
                <button type="button" onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-lg font-bold">-</button>
                <input
                  className='w-14 h-8 text-center border-l border-r outline-none'
                  type='number'
                  name='quantity'
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(productDetail.stock, Number(e.target.value))))}
                  min={1}
                  max={productDetail.stock}
                />
                <button type="button" onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-lg font-bold">+</button>
              </div>
              <span className='text-gray-500'>{productDetail.stock} sản phẩm có sẵn</span>
            </div>

            <button
              type='submit'
              className='w-full max-w-xs bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400'
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
    </div>
  )
}

export default DetailProductClient