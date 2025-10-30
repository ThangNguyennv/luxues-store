import FilterStatus from '~/components/Admin/FilterStatus/FilterStatus'
import Pagination from '~/components/Admin/Pagination/Pagination'
import ProductTable from '~/components/Admin/ItemTable/ProductTable'
import Search from '~/components/Admin/Search/Search'
import { useProduct } from '~/hooks/Admin/product/useProduct'
import { Link } from 'react-router-dom'
import SortProduct from '~/components/Admin/Sort/SortProduct'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const ProductAdmin = () => {
  const {
    dispatchProduct,
    products,
    allProducts,
    filterStatus,
    pagination,
    keyword,
    sortKey,
    sortValue,
    selectedIds,
    setSelectedIds,
    actionType,
    setActionType,
    currentStatus,
    updateSearchParams,
    handleSubmit,
    handleSort,
    clearSortParams,
    handleFilterStatus,
    open,
    handleClose,
    handleConfirmDeleteAll,
    role
  } = useProduct()

  return (
    <>
      {role && role.permissions.includes('products_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md fixed w-[82%]'>
          <h1 className='text-[24px] font-[700] text-[#000000]'>Danh sách sản phẩm</h1>
          <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
            <div className='flex items-center justify-between text-[15px]'>
              <FilterStatus
                filterStatus={filterStatus}
                currentStatus={currentStatus}
                handleFilterStatus={handleFilterStatus}
                items={allProducts}
              />
              <Search
                keyword={keyword}
                handleChangeKeyword={(value) => dispatchProduct({ type: 'SET_DATA', payload: { keyword: value } })}
                handleSearch={(keyword) => updateSearchParams('keyword', keyword)}
              />
            </div>
          </div>
          <div className='flex items-center justify-between text-[15px]'>
            <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
              <select
                name="type"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className='cursor-pointer outline-none border rounded-[5px] border-[#9D9995] p-[5px]'
              >
                <option disabled value={''}>-- Chọn hành động --</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Dừng hoạt động</option>
                <option value="delete-all">Xóa tất cả</option>
              </select>
              <button
                type="submit"
                className='border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'
              >
                Áp dụng
              </button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
              >
                <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Bạn có chắc chắn muốn xóa {selectedIds.length} sản phẩm này không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
                  <Button onClick={handleConfirmDeleteAll} color="error" variant="contained">
                    óa
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
            <SortProduct
              handleSort={handleSort}
              sortKey={sortKey}
              sortValue={sortValue}
              clearSortParams={clearSortParams}
            />
            <div>
              <Link
                to={'/admin/products/create'}
                className='nav-link border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] bg-[#607D00] text-white'
              >
                + Thêm mới
              </Link>
            </div>
          </div>
          <ProductTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <Pagination
            pagination={pagination}
            handlePagination={(page: number) => updateSearchParams('page', (page).toString())}
            handlePaginationPrevious={(page: number) => updateSearchParams('page', (page - 1).toString())}
            handlePaginationNext={(page: number) => updateSearchParams('page', (page + 1).toString())}
            items={products}
          />
        </div>
      )}
    </>
  )
}

export default ProductAdmin