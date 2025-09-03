import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/admin/article/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/admin/article/useTable'
import FormatDateTime from '../Moment/FormatDateTime'
import TableContainer from '@mui/material/TableContainer'
import type { UpdatedBy } from '~/types/helper.type'
import Skeleton from '@mui/material/Skeleton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const ArticleTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    loading,
    articles,
    dispatchArticle,
    accounts,
    handleToggleStatus,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose,
    handleDelete
  } = useTable({ selectedIds, setSelectedIds })

  if (loading) {
    return (
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #757575' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#003459' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên bài viết</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Vị trí</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Người tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 3 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={50} height={26} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={85} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #757575' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#003459' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên bài viết</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Vị trí</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Người tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          {articles && articles.length > 0 ? (
            <>
              <TableBody>
                {articles
                  .map((article, index) => (
                    <TableRow key={article._id}>
                      <TableCell align='center'>
                        <Checkbox
                          checked={selectedIds.includes(article._id)}
                          onChange={(event) => handleCheckbox(article._id, event.target.checked)}
                          {...label}
                          size="small"
                          sx={{ padding: 0 }}
                          value={article._id}
                        />
                      </TableCell>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>{article.title}</TableCell>
                      <TableCell align='center'>
                        <div className='flex justify-center items-center '>
                          <img src={article.thumbnail} alt={article.title} className='w-[100px] h-[100px]'/>
                        </div>
                      </TableCell>
                      <TableCell align='center'>
                        <input
                          onChange={(event) => {
                            const newPosition = parseInt(event.target.value, 10)
                            const updatedArticles = articles.map((item) =>
                              item._id === article._id ? { ...item, position: newPosition } : item
                            )
                            dispatchArticle({
                              type: 'SET_DATA',
                              payload: {
                                articles: updatedArticles
                              }
                            })
                          }}
                          type='number'
                          value={article.position? article.position : ''}
                          min={'1'}
                          data-id={article._id}
                          name='position'
                          className='border rounded-[5px] border-[#00171F] w-[50px] p-[2px]'
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <button
                          onClick={() => handleToggleStatus(article._id, article.status)}
                          className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
                          ${article.status === 'active' ? 'bg-[#607D00]' : 'bg-[#BC3433]'}`}
                        >
                          {article.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </button>
                      </TableCell>
                      <TableCell align='center' className='font-[700] '>{(() => {
                        const creator = accounts.find(
                          (account) => account._id === article.createdBy?.account_id
                        )
                        return creator ? (
                          <>
                            <span className="text-sm font-medium text-gray-800">
                              {creator.fullName}
                            </span>
                            <FormatDateTime time={article.createdAt}/>
                          </>
                        ) : (
                          <span className="text-sm italic text-gray-400">Không xác định</span>
                        )
                      })()}

                      </TableCell>
                      <TableCell align='center'>{(() => {
                        const updatedBy = article.updatedBy?.[(article.updatedBy as UpdatedBy[]).length - 1]
                        if (!updatedBy) {
                          return (
                            <>
                              <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                            </>
                          )
                        }
                        if (Array.isArray(article.updatedBy) && article.updatedBy.length > 0) {
                          const updater = accounts.find((account) => account._id === updatedBy.account_id)
                          return updater ? (
                            <>
                              <span className="text-sm font-medium text-gray-800">
                                {updater.fullName}
                              </span>
                              <FormatDateTime time={updatedBy.updatedAt}/>
                            </>
                          ) : (
                            <span className="text-sm italic text-gray-400">Không xác định</span>
                          )
                        }
                      })()}
                      </TableCell>
                      <TableCell align='center'>
                        <Link
                          to={`/admin/articles/detail/${article._id}`}
                          className='border rounded-[5px] bg-[#757575] p-[5px] text-white'>
                      Chi tiết
                        </Link>
                        <Link
                          to={`/admin/articles/edit/${article._id}`}
                          className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'>
                      Sửa
                        </Link>
                        <button
                          onClick={() => handleOpen(article._id)}
                          className='cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>
                      Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
              >
                <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Bạn có chắc chắn muốn xóa vật phẩm này không?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy</Button>
                  <Button onClick={handleDelete} color="error" variant="contained">
                    Xóa
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ fontWeight: '500', fontSize: '17px' }}>
                  Không có bài viết nào
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default ArticleTable