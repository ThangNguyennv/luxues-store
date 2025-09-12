import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchOrdersAPI } from '~/apis/admin/order.api'
import FilterStatusOrder from '~/components/Admin/FilterStatus/FilterStatusOrder'
import OrderTable from '~/components/Admin/ItemTable/OrderTable'
import Search from '~/components/admin/Search/Search'
import { useOrder } from '~/hooks/admin/Order/useOrder'
import type { OrderAllResponseInterface, OrderInfoInterface } from '~/types/order.type'

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
    handleConfirmDeleteAll
  } = useOrder()


  return (
    <>
      <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md'>
        <h1 className='text-[24px] font-[700] text-[#000000]'>Danh sách đơn hàng</h1>
        <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
          <div>Bộ lọc và tìm kiếm</div>
          <div className='flex items-center justify-between text-[15px]'>
            <FilterStatusOrder
              filterOrder={filterOrder}
              currentStatus={currentStatus}
              handleFilterStatus={handleFilterStatus}
            />
            <Search
              keyword={keyword}
              handleChangeKeyword={(value) => dispatchOrder({ type: 'SET_DATA', payload: { keyword: value } })}
              handleSearch={(keyword) => updateSearchParams('keyword', keyword)}
            />
          </div>
        </div>
        <div className='flex items-center justify-between text-[15px]'>
          {/* <form onSubmit={(event) => handleSubmit(event)} className='flex gap-[5px]'>
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
              <option value="change-position">Thay đổi vị trí</option>
            </select>
            <button
              type="submit"
              className='border rounded-[5px] border-[#9D9995] p-[5px] bg-[#96D5FE]'
            >
                  Áp dụng
            </button>
          </form> */}
          <div>formfilter</div>
          {/* <SortProduct
            handleSort={handleSort}
            sortKey={sortKey}
            sortValue={sortValue}
            clearSortParams={clearSortParams}
          /> */}
          <div>sort</div>
          <div>
            {/* <Link
              to={'/admin/products/create'}
              className='border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] text-[#607D00] hover:bg-[#607D00] hover:text-white'
            >
                  + Thêm mới
            </Link> */}
            <div>them moi</div>
          </div>
        </div>
        <OrderTable
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
        <div>table</div>
        {/* <Pagination
          pagination={pagination}
          handlePagination={(page) => updateSearchParams('page', (page).toString())}
          handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
          handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
          items={products}
        /> */}
        <div>pagination</div>
      </div>
    </>
  )
}

export default OrderAdmin