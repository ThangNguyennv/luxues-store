import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAddProductToCartAPI } from '~/apis/client/cart.api'
import { fetchDetailProductAPI } from '~/apis/client/product.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types/product.type'

const Detail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const params = useParams()
  const slug = params.slug as string
  const productId = productDetail?._id as string
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    if (!slug) return
    fetchDetailProductAPI(slug)
      .then((response: ProductDetailInterface) => {
        setProductDetail(response.product)
      })
  }, [slug])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const quantity = event.currentTarget.quantity.value
    const res = await fetchAddProductToCartAPI(productId, quantity)
    if (res.code === 201) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: res.message, severity: 'success' }
      })
    }
  }

  return (
    <>
      {productDetail && (
        <>
          <div className="flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md">
            <div className="container flex border rounded-[5px]">
              <div className='w-[50%] flex items-center justify-center'>
                <img
                  src={productDetail.thumbnail}
                  alt={productDetail.title}
                  className='w-[440px] h-[530px] object-cover'
                />
              </div>
              <div className='flex flex-col justify-center gap-[30px] w-[50%]'>
                <div className='font-[600] text-[32px]'>{productDetail.title}</div>
                <div className='flex gap-[10px]'>
                  <div className="font-medium text-[26px]">
                    {Math.floor(((productDetail.price * (100 - productDetail.discountPercentage)) / 100)).toLocaleString()}đ
                  </div>
                  {productDetail.discountPercentage > 0 && (
                    <>
                      <div className='line-through text-gray-400 text-[26px]'>{(productDetail.price).toLocaleString()}đ</div>
                      <div className="text-[#BC3433] font-semibold p-[2px] bg-amber-100 text-[20px]">-{productDetail.discountPercentage}%</div>
                    </>
                  )}
                </div>
                <div className='flex items-center gap-[5px] text-[26px]'>
                  <b>Còn lại:</b>
                  {productDetail.stock}
                </div>
                <form
                  onSubmit={handleSubmit}
                  className='flex items-center justify-start gap-[20px] text-center'
                >
                  <input
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className='border rounded-[5px] text-center w-[10%]'
                    type='number'
                    name='quantity'
                    value={quantity}
                    min={1}
                    max={productDetail.stock}
                  />
                  <button
                    type='submit'
                    className='w-[25%] bg-[#000000] text-white border rounded-[20px] py-[16px]'>
                    Thêm vào giỏ hàng
                  </button>
                </form>
              </div>

            </div>

          </div>
        </>
      )}
    </>
  )
}

export default Detail