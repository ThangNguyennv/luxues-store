import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable, type Props } from '~/hooks/admin/Order/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
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
import { getTotalBill } from '~/helpers/TotalBill'

const OrderTable = ({ selectedIds, setSelectedIds }: Props) => {

  const {
    orders,
    loading,
    handleToggleStatus,
    open,
    openPermanentlyDelete,
    handleOpen,
    handleClose,
    handleOpenPermanentlyDelete,
    handleClosePermanentlyDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    accounts,
    handleDelete,
    handleRecover,
    handlePermanentlyDelete
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
              <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 2px' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Đơn hàng</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Khách hàng</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Tổng tiền</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái đơn</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thanh toán</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Phương thức</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Ngày tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 3 }).map((_item, index) => (
              <TableRow key={index}>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400', padding: '0px 2px' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={420} height={70} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="rectangular" width={76} height={32} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center'>
                  <Skeleton variant="text" width={61} height={17} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="text" width={155} height={20} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="text" width={155} height={50} sx={{ bgcolor: 'grey.400' }}/>
                </TableCell>
                <TableCell align='center' className='font-[700] '>
                  <Skeleton variant="rectangular" width={110} height={29} sx={{ bgcolor: 'grey.400' }}/>
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
      {orders && orders.length > 0 ? (
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
                <TableCell align='center' sx={{ backgroundColor: '#003459', padding: '0px 2px' }}>
                  <Checkbox
                    checked={isCheckAll}
                    onChange={(event) => handleCheckAll(event.target.checked)}
                    {...label}
                    size="small"
                    sx={{ padding: 0 }}
                  />
                </TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '0px' }}>Đơn hàng</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Khách hàng</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Tổng tiền</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Trạng thái đơn</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Thanh toán</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Phương thức</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Ngày tạo</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Cập nhật lần cuối</TableCell>
                <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white', padding: '6px 0px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .map((order, index) => (
                  <TableRow key={index}>
                    <TableCell align='center' sx={{ padding: '0px 2px' }}>
                      <Checkbox
                        checked={selectedIds.includes(order._id)}
                        onChange={(event) => handleCheckbox(order._id, event.target.checked)}
                        {...label}
                        size="small"
                        sx={{ padding: 0 }}
                        value={order._id}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '6px 0px' }}>
                      <div className='flex flex-col gap-[7px]'>
                        {order && (
                          order.products.map((product, index) => (
                            <div key={index} className='flex items-center gap-[10px]'>
                              <div>
                                <img src={product.thumbnail} className='w-[70px] h-[70px]'/>
                              </div>
                              <div className='flex flex-col justify-center'>
                                <div className='text-[#00171F] font-[500] line-clamp-1'>
                                  {product.title}
                                </div>
                                <div>
                                  <b>Giá gốc: </b>
                                  {product.price.toLocaleString()}đ
                                </div>
                                <div>
                                  <b>Số lượng: </b>
                                  {product.quantity}
                                </div>
                                {product.discountPercentage > 0 && (
                                  <div>
                                    <b>Mã giảm: </b>
                                    {product.discountPercentage}%
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell align='center' className='font-[700]' sx={{ padding: '6px 0px' }}>
                      <span>{order.userInfo.fullName}</span>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '6px 0px' }}>
                      {Math.floor(getTotalBill(order)).toLocaleString()}đ
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      <button
                        onClick={() => handleToggleStatus(order._id, order.status)}
                        className={`border rounded-[5px] p-[5px] text-white
                          ${order.status === 'confirmed' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
                      >
                        {order.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                      </button>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>Đã thanh toán</TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>VNPAY</TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }} className='font-[700] '>
                      <FormatDateTime time={order.createdAt}/>
                    </TableCell>
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {(() => {
                        const updatedBy = order.updatedBy?.[(order.updatedBy as UpdatedBy[]).length - 1]
                        if (!updatedBy) {
                          return (
                            <>
                              <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                            </>
                          )
                        }
                        if (Array.isArray(order.updatedBy) && order.updatedBy.length > 0) {
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
                    <TableCell align='center' sx={{ padding: '6px 0px' }}>
                      {order.deleted ? (
                        <>
                          <button
                            onClick={() => handleRecover(order._id)}
                            className='nav-link border rounded-[5px] bg-[#525FE1] p-[5px] text-white'
                          >
                            Mua lại
                          </button>
                          <button
                            onClick={() => handleOpenPermanentlyDelete(order._id)}
                            className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/admin/orders/detail/${order._id}`}
                            className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                          >
                            Chi tiết
                          </Link>
                          <button
                            onClick={() => handleOpen(order._id)}
                            className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                          >
                            Hủy
                          </button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <Dialog
              open={openPermanentlyDelete}
              onClose={handleClose}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePermanentlyDelete}>Hủy</Button>
                <Button onClick={handlePermanentlyDelete} color="error" variant="contained">
                    Xóa
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="delete-dialog-title"
            >
              <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn hủy đơn hàng này không?
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
        <div className='flex items-center justify-center'>Không tồn tại đơn hàng nào.</div>
      )}
    </>
  )
}

export default OrderTable