import FilterStatus from '~/components/admin/FilterStatus/FilterStatus'
import Pagination from '~/components/admin/Pagination/Pagination'
import Search from '~/components/admin/Search/Search'
import { Link } from 'react-router-dom'
import { useArticle } from '~/hooks/admin/article/useArticle'
import ArticleTable from '~/components/admin/ItemTable/ArticleTable'
import SortRecords from '~/components/admin/Sort/SortRecords'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const ArticleAdmin = () => {
  const {
    dispatchArticle,
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
    articles,
    role,
    allArticles,
    open,
    handleClose,
    handleConfirmDeleteAll
  } = useArticle()

  return (
    <>
      {role && role.permissions.includes('articles_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md h-[820px] fixed w-[80%]'>
          <h1 className='text-[24px] font-[700] text-[#000000]'>Danh sách bài viết</h1>
          <div className='text-[20px] font-[500] text-[#000000] pb-[15px] px-[15px] shadow-md flex flex-col gap-[10px]'>
            <div className='flex items-center justify-between text-[15px]'>
              <FilterStatus
                filterStatus={filterStatus}
                currentStatus={currentStatus}
                handleFilterStatus={handleFilterStatus}
                items={allArticles}
              />
              <Search
                keyword={keyword}
                handleChangeKeyword={(value) => dispatchArticle({ type: 'SET_DATA', payload: { keyword: value } })}
                handleSearch={(keyword) => updateSearchParams('keyword', keyword)}/>
            </div>
          </div>
          <div className='flex items-center justify-between'>
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
                type='submit'
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
                    Bạn có chắc chắn muốn xóa {selectedIds.length} bài viết này không?
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
            <SortRecords
              handleSort={handleSort}
              sortKey={sortKey}
              sortValue={sortValue}
              clearSortParams={clearSortParams}
            />
            <div>
              <Link
                to={'/admin/articles/create'}
                className='border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] text-[#607D00] hover:bg-[#607D00] hover:text-white'
              >
              + Thêm mới
              </Link>
            </div>
          </div>
          <ArticleTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          <Pagination
            pagination={pagination}
            handlePagination={(page) => updateSearchParams('page', (page).toString())}
            handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
            handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
            items={articles}
          />
        </div>
      )}
    </>
  )
}

export default ArticleAdmin