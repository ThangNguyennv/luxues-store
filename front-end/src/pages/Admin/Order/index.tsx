import Pagination from '~/components/admin/Pagination/Pagination'
import Search from '~/components/admin/Search/Search'
import SortOrder from '~/components/admin/Sort/SortOrder'
import { useOrder } from '~/hooks/admin/Order/useOrder'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FilterStatusOrder from '~/components/admin/FilterStatus/FilterStatusOrder'
import OrderTable from '~/components/admin/ItemTable/OrderTable'
import type { OrderStatus } from '~/types/order.type'
import { FaTrashAlt } from 'react-icons/fa'

const OrderAdmin = () => {
  const {
    dispatchOrder,
    orders,
    filterOrder,
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
    role,
    allOrders
  } = useOrder()

  return (
    <>
      {role && role.permissions.includes('orders_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md h-[820px] fixed w-[80%]'>
          <h1 className='text-[24px] font-[700] text-[#000000]'>Danh sách đơn hàng</h1>
          <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
            <div className='flex items-center justify-between text-[15px]'>
              <div className='flex items-center justify-center gap-[15px]'>
                <FilterStatusOrder
                  filterOrder={filterOrder}
                  currentStatus={currentStatus as OrderStatus}
                  handleFilterStatus={handleFilterStatus}
                  items={allOrders}
                />
                <button className='p-[5px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] flex items-center justify-center gap-[5px]'>
                  <FaTrashAlt />
                  <span>Thùng rác</span>
                </button>
              </div>
              <Search
                keyword={keyword}
                handleChangeKeyword={(value) => dispatchOrder({ type: 'SET_DATA', payload: { keyword: value } })}
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
                <option value="PENDING">Đang xử lý</option>
                <option value="TRANSPORTING">Đang giao hàng</option>
                <option value="CONFIRMED">Hoàn thành</option>
                <option value="CANCELED">Hủy tất cả</option>
                <option value="DELETEALL">Xóa tất cả</option>
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
                    Bạn có chắc chắn muốn hủy {selectedIds.length} đơn hàng này không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
                  <Button onClick={handleConfirmDeleteAll} color="error" variant="contained">
                    Xóa
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
            <SortOrder
              handleSort={handleSort}
              sortKey={sortKey}
              sortValue={sortValue}
              clearSortParams={clearSortParams}
            />
          </div>
          <OrderTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <Pagination
            pagination={pagination}
            handlePagination={(page) => updateSearchParams('page', (page).toString())}
            handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
            handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
            items={orders}
          />
        </div>
      )}
    </>
  )
}

export default OrderAdmin