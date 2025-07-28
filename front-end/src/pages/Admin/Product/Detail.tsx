import { useEffect, useState } from 'react'
import { fetchDetailProductAPI } from '~/apis'
import type { ProductDetailInterface, ProductInterface } from '~/components/Admin/Types/Interface'

const DetailProducts = () => {
  const [productDetail, setProductDetail] = useState<ProductDetailInterface | null>(null)
  const [id, setId] = useState('')

  useEffect(() => {
    fetchDetailProductAPI(id).then((res: ProductInterface) => {
      setProductDetail(res.product)
    })
  }, [id])
  return (
    <>
      {productDetail && (
        <div>
          <h1 className='text-[35px] font-[600] text-[#00171F] underline'>{productDetail.title}</h1>
          <div className=''>
            Giá: <b>${productDetail.price}</b>
          </div>
          <div>
            Giảm giá: <b>{productDetail.discountPercentage}</b>
          </div>
          <div>
            Còn lại: <b>{productDetail.stock}</b>
          </div>
          <div>
            <img src={productDetail.thumbnail} alt={productDetail.title}/>
          </div>
          <div>
            Trạng thái: <b>{productDetail.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}</b>
          </div>
          <div>
            Vị trí: <b>{productDetail.position}</b>
          </div>
          <div>
            Mô tả: <b>{productDetail.description}</b>
          </div>
          <button className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'>Chỉnh sửa</button>
        </div>
      )}
    </>
  )
}

export default DetailProducts