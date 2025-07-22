import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { fetchProductAllAPI } from '~/apis/index'
import FilterStatusProps from '~/components/Admin/FilterStatus/FilterStatus'
import PaginationProps from '~/components/Admin/Pagination/Pagination'
import ProductTableProps from '~/components/Admin/ProductTable/ProductTable'
import SearchProps from '~/components/Admin/Search/Search'
import type { ProductInterface } from '~/components/Admin/Types/Interface'
import type { FilterStatusInterface } from '~/components/Admin/Types/Interface'
import type { PaginationInterface } from '~/components/Admin/Types/Interface'
import type { ProductAllResponseInterface } from '~/components/Admin/Types/Interface'

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatusInterface[]>([])
  const [pagination, setPagination] = useState<PaginationInterface | null>(null)
  const [keyword, setKeyword] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''

  useEffect(() => {
    fetchProductAllAPI(currentStatus, currentPage, currentKeyword).then((res: ProductAllResponseInterface) => {
      setProducts(res.products)
      setPagination(res.pagination)
      setFilterStatus(res.filterStatus)
      setKeyword(res.currentKeyword)
    })
  }, [currentStatus, currentPage, currentKeyword])

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  return (
    <>
      <div className='flex flex-col gap-[15px]'>
        <h1 className='text-[30px] font-[700] text-[#000000]'>Danh sách sản phẩm</h1>
        <div className='text-[20px] font-[500] text-[#000000] p-[15px] border rounded-[5px] flex flex-col gap-[10px]'>
          <div>Bộ lọc và tìm kiếm</div>
          <div className='flex items-center justify-between text-[15px]'>
            <FilterStatusProps
              filterStatus={filterStatus}
              currentStatus={currentStatus}
              handleFilterStatus={(status) => updateSearchParams('status', status)}
            />
            <SearchProps
              keyword={keyword}
              setKeyword={setKeyword}
              handleSearch={(keyword) => updateSearchParams('keyword', keyword)}/>
          </div>
        </div>
        <ProductTableProps products={products}/>
        <PaginationProps
          pagination={pagination}
          handlePagination={(page) => updateSearchParams('page', page)}
          handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
          handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
        />
      </div>
    </>
  )
}

export default ProductAdmin