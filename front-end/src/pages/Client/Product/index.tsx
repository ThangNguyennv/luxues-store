import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import Pagination from '~/components/admin/Pagination/Pagination'
import { useProductContext } from '~/contexts/client/ProductContext'
import Skeleton from '@mui/material/Skeleton'
import { FilterSidebar } from '~/components/client/FilterSidebar/FilterSidebar'
import { FaFilter, FaTimes, FaSort } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { SortDropdown } from '~/components/client/SortDropdown/SortDropdown'

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

const ProductClient = () => {
  const { stateProduct, fetchProduct } = useProductContext()
  const { products, pagination, loading, allProducts } = stateProduct
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || 'position'
  const currentSortValue = searchParams.get('sortValue') || 'desc'
  const currentCategory = searchParams.get('category') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentColor = searchParams.get('color') || ''
  const currentSize = searchParams.get('size') || ''

  useEffect(() => {
    // === SỬA LỖI: TRUYỀN TẤT CẢ PARAMS VÀO FETCHPRODUCT ===
    fetchProduct({
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue,
      category: currentCategory,
      maxPrice: currentMaxPrice,
      color: currentColor,
      size: currentSize
    })
  }, [
    currentPage, currentKeyword, currentSortKey, currentSortValue,
    currentCategory, currentMaxPrice, currentColor, currentSize,
    fetchProduct
  ])

  // Khóa cuộn trang khi mở filter trên mobile
  useEffect(() => {
    document.body.style.overflow = (isFilterOpen || isSortOpen) ? 'hidden' : 'auto'
  }, [isFilterOpen, isSortOpen])

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }
  const handleSortChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sortKey', key)
    newParams.set('sortValue', value)
    newParams.set('page', '1') // Luôn reset về trang 1 khi sắp xếp
    setSearchParams(newParams)
    setIsSortOpen(false) // Đóng drawer sort (nếu đang mở)
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px] px-4 md:px-6 lg:px-8">
          <BoxHead title={'Tất cả sản phẩm'}/>
          {/* === NÚT MỞ FILTER TRÊN MOBILE === */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
            >
              <FaFilter />
              <span>Bộ lọc</span>
            </button>
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
            >
              <FaSort />
              <span>Sắp xếp</span>
            </button>
          </div>

          {/* 4. CẬP NHẬT BỐ CỤC 2 CỘT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">

            {/* Cột Filter (chỉ hiển thị trên desktop) */}
            <aside className="hidden lg:block lg:col-span-1">
              <FilterSidebar />
            </aside>

            {/* Cột Sản phẩm */}
            <main className="lg:col-span-3">
              {/* === THANH SẮP XẾP (DESKTOP) === */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <span className="text-sm text-gray-600">
                  {pagination.currentPage}/{pagination.totalPage || 0} trang
                </span>
                <SortDropdown
                  sortKey={currentSortKey}
                  sortValue={currentSortValue}
                  onSortChange={handleSortChange}
                />
              </div>
              {loading ? (
              // 5. Hiển thị Skeleton UI
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <CardItemSkeleton key={index} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  {/* 6. Grid sản phẩm bên trong cột main */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
                    {products.map((product) => (
                      <Link to={`/products/detail/${product.slug}`} key={product._id || product.slug} className="h-full">
                        <CardItem item={product}/>
                      </Link>
                    ))}
                  </div>
                  {/* 7. Pagination */}
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
            </main>
          </div>
        </div>
      </div>
      {/* === MOBILE FILTER DRAWER === */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Lớp phủ mờ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1000] lg:hidden"
            />
            {/* Ngăn kéo filter */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 w-full max-w-xs h-full bg-white z-[1001] lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold">Bộ lọc</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="text-2xl">
                    <FaTimes />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <FilterSidebar onClose={() => setIsFilterOpen(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* === MOBILE SORT DRAWER (Mới) === */}
      <AnimatePresence>
        {isSortOpen && (
          <>
            {/* Lớp phủ mờ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSortOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1000] lg:hidden"
            />
            {/* Ngăn kéo trượt từ dưới lên */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed bottom-0 left-0 w-full bg-white z-[1001] lg:hidden rounded-t-2xl"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Sắp xếp</h2>
                  <button onClick={() => setIsSortOpen(false)} className="text-2xl"><FaTimes /></button>
                </div>
                <div className="flex flex-col gap-2">
                  <SortDropdown
                    sortKey={currentSortKey}
                    sortValue={currentSortValue}
                    onSortChange={handleSortChange}
                    isMobile={true} // Báo cho component con biết đây là bản mobile
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductClient

