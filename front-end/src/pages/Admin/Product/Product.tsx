import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { fetchChangeMultiAPI, fetchProductAllAPI } from '~/apis/index'
import FilterStatusProps from '~/components/Admin/FilterStatus/FilterStatus'
import PaginationProps from '~/components/Admin/Pagination/Pagination'
import ProductTableProps from '~/components/Admin/ProductTable/ProductTable'
import SearchProps from '~/components/Admin/Search/Search'
import type { ProductDetailInterface } from '~/components/Admin/Types/Interface'
import type { FilterStatusInterface } from '~/components/Admin/Types/Interface'
import type { PaginationInterface } from '~/components/Admin/Types/Interface'
import type { ProductAllResponseInterface } from '~/components/Admin/Types/Interface'
import { AlertToast } from '~/components/Alert/Alert'

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductDetailInterface[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatusInterface[]>([])
  const [pagination, setPagination] = useState<PaginationInterface | null>(null)
  const [keyword, setKeyword] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const [actionType, setActionType] = useState('')
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const typeChange = actionType
    if (selectedIds.length > 0) {
      if (actionType === '') {
        setAlertMessage('Vui lòng chọn hành động')
        setAlertSeverity('error')
        setAlertOpen(true)
        return
      }
      if (typeChange === 'delete-all') {
        const isConfirm = confirm('Bạn có chắc muốn xóa tất cả những sản phẩm này?')
        if (!isConfirm) return
      }
      const selectedProducts = products.filter(product =>
        selectedIds.includes(product._id)
      )
      let result: string[] = []
      if (typeChange === 'change-position') {
        result = selectedProducts.map(product => {
          const positionInput = document.querySelector<HTMLInputElement>(
            `input[name="position"][data-id="${product._id}"]`
          )
          const position = positionInput?.value || ''
          return `${product._id}-${position}`
        })
      } else {
        result = selectedProducts.map(product => product._id)
      }
      const response = await fetchChangeMultiAPI({ ids: result, type: typeChange })
      if (response.code === 200) {
        setAlertMessage(`${response.message}`)
        setAlertSeverity('success')
        setAlertOpen(true)
      } else if (response.code === 204) {
        setAlertMessage(`${response.message}`)
        setAlertSeverity('success')
        setAlertOpen(true)
      } else if (response.code === 404) {
        setAlertMessage(`${response.message}`)
        setAlertSeverity('error')
        setAlertOpen(true)
      }
      setSelectedIds([])
      setActionType('')
      fetchProductAllAPI(currentStatus, currentPage, currentKeyword).then((res: ProductAllResponseInterface) => {
        setProducts(res.products)
        setPagination(res.pagination)
        setFilterStatus(res.filterStatus)
        setKeyword(res.currentKeyword)
      })
    } else {
      setAlertMessage('Vui lòng chọn ít nhất một bản ghi!')
      setAlertSeverity('error')
      setAlertOpen(true)
    }
  }

  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
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
        <div className='flex items-center justify-between'>
          <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
            <select
              name="type"
              id=""
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px]'
            >
              <option disabled value={''}>-- Chọn hành động --</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Dừng hoạt động</option>
              <option value="delete-all">Xóa tất cả</option>
              <option value="change-position">Thay đổi vị trí</option>
            </select>
            <button
              type='submit'
              className='cursor-pointer border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'>
                Áp dụng
            </button>
          </form>
        </div>
        <ProductTableProps
          listProducts={products}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
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