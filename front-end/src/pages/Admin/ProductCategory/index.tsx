import { Link } from 'react-router-dom'
import FilterStatusProps from '~/components/admin/FilterStatus/FilterStatus'
import ProductCategoryTableProps from '~/components/admin/ItemTable/ProductCategoryTable'
import PaginationProps from '~/components/admin/Pagination/Pagination'
import SearchProps from '~/components/admin/Search/Search'
import { AlertToast } from '~/components/alert/Alert'
import { useProductCategory } from '~/hooks/admin/productCategory/useProductCategory'

const ProductCategoryAdmin = () => {
  const {
    products,
    accounts,
    filterStatus,
    pagination,
    keyword,
    setKeyword,
    sortKey,
    sortValue,
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
    handleSubmit,
    handleSort,
    clearSortParams
  } = useProductCategory()

  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
      <h1 className="text-[30px] font-[700] text-[#000000]">Danh mục sản phẩm</h1>
      <div className='flex flex-col gap-[15px]'>
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
          <div className='flex gap-[10px] items-center'>
            <select
              onChange={(event) => handleSort(event)}
              className='cursor-pointer border rounded-[5px] border-[#9D9995] p-[5px] outline-none'
              value={sortKey && sortValue ? `${sortKey}-${sortValue}` : ''}
            >
              <option disabled value={''}>-- Sắp xếp --</option>
              <option value="position-asc">Vị trí tăng dần</option>
              <option value="position-desc">Vị trí giảm dần</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="title-asc">Tiêu đề A - Z</option>
              <option value="title-desc">Tiêu đề Z - A</option>
            </select>
            <button
              onClick={clearSortParams}
              className='cursor-pointer border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'
            >
              Clear
            </button>
          </div>
          <div>
            <Link to={'/admin/products/create'} className='border rounded-[5px] px-[55px] py-[5px] border-[#607D00] font-[600] text-[#607D00] hover:bg-[#607D00] hover:text-white'>+ Thêm mới</Link>
          </div>
        </div>
        <ProductCategoryTableProps
          listProducts={products}
          listAccounts={accounts}
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

export default ProductCategoryAdmin