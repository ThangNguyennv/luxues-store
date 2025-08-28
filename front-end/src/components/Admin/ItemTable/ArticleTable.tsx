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

const ArticleTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    articles,
    dispatchArticle,
    accounts,
    handleToggleStatus,
    handleDeleteArticle,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  } = useTable({ selectedIds, setSelectedIds })

  return (
    <>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #000000' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>STT</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Tên sản phẩm</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Vị trí</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Người tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          {articles && articles.length > 0 ? (
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
                        data-_id={article._id}
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
                        onClick={() => handleDeleteArticle(article._id)}
                        className='cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>
                      Xóa
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={50} height={26} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={120} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="rectangular" width={200} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={200} height={40} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={200} height={32} sx={{ bgcolor: 'grey.400' }}/>
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