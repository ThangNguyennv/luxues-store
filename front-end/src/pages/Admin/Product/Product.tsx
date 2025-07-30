import FilterStatusProps from '~/components/Admin/FilterStatus/FilterStatus'
import PaginationProps from '~/components/Admin/Pagination/Pagination'
import ProductTableProps from '~/components/Admin/ItemTable/ItemTable'
import SearchProps from '~/components/Admin/Search/Search'
import { AlertToast } from '~/components/Alert/Alert'
import { useProductAdmin } from '~/hooks/Admin/Product/useProduct'
import { Link } from 'react-router-dom'

const ProductAdmin = () => {
  const {
    products,
    filterStatus,
    pagination,
    keyword,
    setKeyword,
    selectedIds,
    setSelectedIds,
    alertOpen,
    alertMessage,
    alertSeverity,
    setAlertOpen,
    actionType,
    setActionType,
    currentStatus,
    updateSearchParams,
    handleSubmit
  } = useProductAdmin()

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
          <div>
            <button>sort</button>
          </div>
          <div>
            <Link to={'/admin/products/create'} className='border rounded-[5px] px-[55px] py-[5px] border-[#607D00] font-[600] text-[#607D00] hover:bg-[#607D00] hover:text-white'>+ Thêm mới</Link>
          </div>
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