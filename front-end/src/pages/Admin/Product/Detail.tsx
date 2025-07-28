import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis'
import type { ProductDetailInterface, ProductInterface } from '~/components/Admin/Types/Interface'
import { stripHTML } from '~/utils/stripHTML'

const DetailProduct = () => {
  const [productDetail, setProductDetail] = useState<ProductDetailInterface | null>(null)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductInterface) => {
        setProductDetail(response.product)
      })
  }, [id])

  return (
    <>
      {productDetail && (
        <div className='flex flex-col gap-[10px]'>
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
            <img src={productDetail.thumbnail} alt={productDetail.title} className='w-[150px] h-[150px]'/>
          </div>
          <div>
            Trạng thái: <b>{productDetail.status === 'active' ? <span className="text-green-500"> Hoạt động</span> : <span className="text-red-500"> Dừng hoạt động</span>}</b>
          </div>
          <div>
            Vị trí: <b>{productDetail.position}</b>
          </div>
          <div>
            Mô tả: <b>{stripHTML(productDetail.description)}</b>
          </div>
          <Link to={`/admin/products/edit/${id}`} className='cursor-pointer border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'>Chỉnh sửa</Link>
        </div>
      )}
    </>
  )
}

export default DetailProduct