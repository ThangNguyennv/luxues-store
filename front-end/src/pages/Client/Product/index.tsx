import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import Pagination from '~/components/admin/Pagination/Pagination'
import { useProductContext } from '~/contexts/client/ProductContext'
import Skeleton from '@mui/material/Skeleton'

const ProductClient = () => {
  const { stateProduct, fetchProduct } = useProductContext()
  const { products, pagination, loading } = stateProduct
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchProduct({
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentPage, currentKeyword, currentSortKey, currentSortValue, fetchProduct])

  const CardItemSkeleton = () => (
    <div className="flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] text-center h-full">
      <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: '4px' }} />
      <div className="flex flex-col items-center gap-2 px-2 pb-2 w-full">
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={28} />
      </div>
    </div>
  )

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }

    // Nếu xóa sortKey hoặc sortValue → xóa cả 2
    if ((key === 'sortKey' || key === 'sortValue') && !value) {
      newParams.delete('sortKey')
      newParams.delete('sortValue')
    }

    setSearchParams(newParams)
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px] px-4 md:px-6 lg:px-8">
          <BoxHead title={'Tất cả sản phẩm'}/>
          {loading ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
              {Array.from({ length: 8 }).map((_, index) => (
                <CardItemSkeleton key={index} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                {products.map((product) => (
                  <Link to={`/products/detail/${product.slug}`} key={product._id || product.slug} className="h-full">
                    <CardItem item={product}/>
                  </Link>
                ))}
              </div>
              {/* Chỉ hiển thị Pagination nếu có nhiều hơn 1 trang */}
              {pagination && pagination.totalPage > 1 && (
                <Pagination
                  pagination={pagination}
                  handlePagination={(page) => updateSearchParams('page', (page).toString())}
                  handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
                  handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
                  items={products}
                />
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-16">Không tìm thấy sản phẩm nào.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductClient