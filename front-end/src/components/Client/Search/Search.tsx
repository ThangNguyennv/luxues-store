// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { fetchSearchAPI } from '~/apis/client/search.api'
// import BoxHead from '~/components/client/BoxHead/BoxHead'
// import CardItem from '~/components/client/CardItem/CardItem'
// import { useProductContext } from '~/contexts/client/ProductContext'
// import type { ProductInfoInterface } from '~/types/product.type'
// import type { SearchInterface } from '~/types/search.type'

// const Search = () => {
//   const [products, setProducts] = useState<ProductInfoInterface[]>([])
//   const { stateProduct } = useProductContext()
//   const { keyword } = stateProduct

//   useEffect(() => {
//     if (!keyword) return
//     fetchSearchAPI(keyword).then((res: SearchInterface) => {
//       setProducts(res.products)
//     })
//   }, [keyword])

//   return (
//     <>
//       <div className="flex items-center justify-center">
//         <div className="container flex flex-col gap-[10px] mb-[150px]">
//           <BoxHead title="Kết quả tìm kiếm"/>
//           {products && (
//             <div className='grid grid-cols-4 gap-[15px]'>
//               {products.map((product, index) => (
//                 <Link to={`/products/detail/${product.slug}`} key={index}>
//                   <CardItem {...product}/>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProductContext } from '~/contexts/client/ProductContext'
import CardItem from '~/components/client/CardItem/CardItem'
import Skeleton from '@mui/material/Skeleton' // Để hiển thị loading
import Pagination from '~/components/admin/Pagination/Pagination'

const Search = () => {
  // 1. Lấy state và hàm fetch từ Context
  const { stateProduct, fetchProduct } = useProductContext()
  const { products, loading, pagination } = stateProduct

  // 2. Dùng useSearchParams để đọc `keyword` từ URL
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  // Thêm các tham số khác nếu cần (sortKey, sortValue...)

  // 3. DÙNG useEffect ĐỂ GỌI API KHI KEYWORD THAY ĐỔI - ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT
  useEffect(() => {
    // Gọi hàm fetchProduct từ context với các tham số lấy từ URL
    fetchProduct({
      keyword: keyword,
      page: page
      // Thêm sortKey, sortValue nếu có
    })
  }, [keyword, page, fetchProduct]) // Chạy lại mỗi khi keyword hoặc page trên URL thay đổi
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
    <div className="container mx-auto px-[16px] my-[30px] mb-[150px]">
      <h1 className="text-center text-3xl font-bold mb-8">
        Kết quả tìm kiếm cho: {keyword}
      </h1>

      {loading && (
        // Hiển thị skeleton UI khi đang tải
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from(new Array(8)).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={300} />
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        // Hiển thị danh sách sản phẩm
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Link to={`/products/detail/${product.slug}`} key={index}>
                <CardItem {...product}/>
              </Link>
            ))}
          </div>
          <Pagination
            pagination={pagination}
            handlePagination={(page) => updateSearchParams('page', (page).toString())}
            handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
            handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
            items={products}
          />
        </>
      )}

      {!loading && products.length === 0 && (
        // Hiển thị thông báo khi không tìm thấy
        <div className="text-center text-gray-500 mt-10">
          <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.</p>
        </div>
      )}

      {/* Thêm component phân trang ở đây nếu cần */}
    </div>
  )
}

export default Search