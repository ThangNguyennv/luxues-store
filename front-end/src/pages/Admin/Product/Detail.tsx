import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/admin/product/useDetail'

const DetailProduct = () => {
  const {
    productDetail,
    id
  } = useDetail()

  return (
    <>
      {productDetail ? (
        <>
          <div className='text-[35px] font-[600] text-[#00171F]'>
            Chi tiết sản phẩm
          </div>
          <div className='flex justify-between gap-[10px] border rounded-[5px] p-[20px] w-[50%]'>
            <div className='flex flex-col gap-[15px]'>
              <div className=''>
                <b>Tên sản phẩm: </b>
                {productDetail.title}
              </div>
              <div className=''>
                <b>Giá: </b>
                {productDetail.price.toLocaleString('vi-VN')}đ
              </div>
              <div>
                <b>Giảm giá: </b>
                {productDetail.discountPercentage}
              </div>
              <div>
                <b>Còn lại: </b>
                {productDetail.stock}
              </div>
              <div>
                <b>Trạng thái: </b>
                {
                  productDetail.status === 'active' ?
                    <span className="text-green-500 font-[600]">Hoạt động</span> :
                    <span className="text-red-500 font-[600]"> Dừng hoạt động</span>
                }
              </div>
              <div>
                <b>Vị trí: </b>
                {productDetail.position}
              </div>
              <div>
                <b>Mô tả: </b>
                <div dangerouslySetInnerHTML={{ __html: productDetail.description }} />
              </div>
              <Link
                to={`/admin/products/edit/${id}`}
                className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
              >
                Chỉnh sửa
              </Link>
            </div>
            <div>
              <b>Ảnh: </b>
              <img
                src={productDetail.thumbnail}
                alt={productDetail.title}
                className='w-[350px] h-[350px]'
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
          <div className='flex justify-between gap-[10px] border rounded-[5px] p-[20px] w-[50%]'>
            <div className='flex flex-col gap-[15px]'>
              <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div>
              <Skeleton variant="text" width={34} height={20} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={317} height={350} sx={{ bgcolor: 'grey.400' }}/>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DetailProduct