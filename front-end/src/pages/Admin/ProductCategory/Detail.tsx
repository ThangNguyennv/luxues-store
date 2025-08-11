import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/admin/product/useDetail'

const DetailProduct = () => {
  const {
    productDetail,
    id
  } = useDetail()

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
            Mô tả: <div dangerouslySetInnerHTML={{ __html: productDetail.description }} />
          </div>
          <Link to={`/admin/products/edit/${id}`} className='cursor-pointer border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'>Chỉnh sửa</Link>
        </div>
      )}
    </>
  )
}

export default DetailProduct