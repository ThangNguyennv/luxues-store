import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/admin/product/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/admin/product/useTable'
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

const ProductTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    products,
    loading,
    dispatchProduct,
    accounts,
    handleToggleStatus,
    open,
    handleOpen,
    handleClose,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  } = useTable({ selectedIds, setSelectedIds })

  if (loading) {
    return (
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table size='small' sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #757575' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 8px' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên sản phẩm</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Giá</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Vị trí</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Người tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 8px' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={350} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={70} height={70} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="text" width={70} height={40} sx={{ bgcolor: 'grey.400' }}/>
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
      {products && products.length > 0 ? (
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table size='small' sx={{
            borderCollapse: 'collapse',
            '& th, & td': {
              border: '1px solid #757575', // đường kẻ
              fontSize: '14px'
            }
          }}>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 8px' }}>
                  <Checkbox
                    checked={isCheckAll}
                    onChange={(event) => handleCheckAll(event.target.checked)}
                    {...label}
                    size="small"
                    sx={{ padding: 0 }}
                  />
                </TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 8px' }}>STT</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Tên sản phẩm</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '10px 0px' }}>Hình ảnh</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Giá</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Vị trí</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Trạng thái</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Người tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Cập nhật lần cuối</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell align='center' sx={{ padding: '0px 8px' }}>
                      <Checkbox
                        checked={selectedIds.includes(product._id)}
                        onChange={(event) => handleCheckbox(product._id, event.target.checked)}
                        {...label}
                        size="small"
                        sx={{ padding: 0 }}
                        value={product._id}
                      />
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '0px' }}>{index + 1}</TableCell>
                    <TableCell align='left' sx={{ padding: '10px' }}>{product.title}</TableCell>
                    <TableCell align='center' sx={{ padding: '10px 16px' }}>
                      <div className='flex justify-center items-center'>
                        <img src={product.thumbnail} alt={product.title} className='w-[70px] h-[70px]'/>
                      </div>
                    </TableCell>
                    <TableCell align="center">{product.price.toLocaleString()}đ</TableCell>
                    <TableCell align='center'>
                      <input
                        onChange={(event) => {
                          const newPosition = parseInt(event.target.value, 10)
                          const updatedProducts = products.map((item) =>
                            item._id === product._id ? { ...item, position: newPosition } : item
                          )
                          dispatchProduct({
                            type: 'SET_DATA',
                            payload: {
                              products: updatedProducts
                            }
                          })
                        }}
                        type='number'
                        value={product ? product.position : ''}
                        min={1}
                        data-id={product._id}
                        name='position'
                        className='border rounded-[5px] border-[#003459] w-[50px] p-[2px]'
                      />
                    </TableCell>
                    <TableCell align='center'>
                      <button
                        onClick={() => handleToggleStatus(product._id, product.status)}
                        className={`border rounded-[5px] p-[5px] text-white 
                          ${product.status === 'active' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
                      >
                        {product.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </button>
                    </TableCell>
                    <TableCell align='center' className='font-[700] '>{(() => {
                      const creator = accounts.find(
                        (account) => account._id === product.createdBy?.account_id
                      )
                      return creator ? (
                        <>
                          <span className="text-sm font-medium text-gray-800">
                            {creator.fullName}
                          </span>
                          <FormatDateTime time={product.createdAt}/>
                        </>
                      ) : (
                        <span className="text-sm italic text-gray-400">Không xác định</span>
                      )
                    })()}

                    </TableCell>
                    <TableCell align='center'>{(() => {
                      const updatedBy = product.updatedBy?.[(product.updatedBy as UpdatedBy[]).length - 1]
                      if (!updatedBy) {
                        return (
                          <>
                            <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                          </>
                        )
                      }
                      if (Array.isArray(product.updatedBy) && product.updatedBy.length > 0) {
                        const updater = accounts.find((account) => account._id === updatedBy.account_id)
                        return updater ? (
                          <>
                            <span className="text-sm font-medium text-gray-800">
                              {updater.fullName}
                            </span>
                            <FormatDateTime time={updatedBy.updatedAt}/>
                          </>
                        ) : (
                          <span className="text-sm italic text-gray-400">
                              Không xác định
                          </span>
                        )
                      }
                    })()}
                    </TableCell>
                    <TableCell align='center'>
                      <Link
                        to={`/admin/products/detail/${product._id}`}
                        className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                      >
                          Chi tiết
                      </Link>
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                      >
                          Sửa
                      </Link>
                      <button
                        onClick={() => handleOpen(product._id)}
                        className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                      >
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
                    Bạn có chắc chắn muốn xóa sản phẩm này không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                    Xóa
                </Button>
              </DialogActions>
            </Dialog>
          </Table>
        </TableContainer>
      ) : (
        <div className="flex items-center justify-center">Không tồn tại sản phẩm nào.</div>
      )}
    </>
  )
}

export default ProductTable