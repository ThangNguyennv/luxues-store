import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/admin/productCategory/useDetail'

const DetailProductCategory = () => {
  const {
    productCategoryDetail,
    id
  } = useDetail()

  return (
    <>
      {productCategoryDetail && (
        <div className='flex flex-col gap-[10px]'>
          <h1 className='text-[35px] font-[600] text-[#00171F] underline'>{productCategoryDetail.title}</h1>
          <div>
            <img src={productCategoryDetail.thumbnail} alt={productCategoryDetail.title} className='w-[150px] h-[150px]'/>
          </div>
          <div>
            Trạng thái: <b>{productCategoryDetail.status === 'active' ? <span className="text-green-500"> Hoạt động</span> : <span className="text-red-500"> Dừng hoạt động</span>}</b>
          </div>
          <div>
            Vị trí: <b>{productCategoryDetail.position}</b>
          </div>
          <div>
            Mô tả: <div dangerouslySetInnerHTML={{ __html: productCategoryDetail.description }} />
          </div>
          <Link to={`/admin/products-category/edit/${id}`} className='cursor-pointer border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'>Chỉnh sửa</Link>
        </div>
      )}
    </>
  )
}

export default DetailProductCategory