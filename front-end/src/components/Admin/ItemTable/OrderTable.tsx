import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { Link } from 'react-router-dom'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/admin/Order/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/admin/order/useTable'
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
    dispatchOrder,
    handleToggleStatus,
    open,
    handleOpen,
    handleClose,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    selectedId,
    accounts
  } = useTable({ selectedIds, setSelectedIds })

  //   if (loading) {
  //     return (
  //       <TableContainer sx={{ maxHeight: 600 }}>
  //         <Table sx={{
  //           borderCollapse: 'collapse',
  //           '& th, & td': {
  //             border: '1px solid #757575' // đường kẻ
  //           }
  //         }}>
  //           <TableHead>
  //             <TableRow>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459' }}>
  //                 <Checkbox
  //                   checked={isCheckAll}
  //                   onChange={(event) => handleCheckAll(event.target.checked)}
  //                   {...label}
  //                   size="small"
  //                   sx={{ padding: 0 }}
  //                 />
  //               </TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>STT</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên sản phẩm</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hình ảnh</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Giá</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Vị trí</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Trạng thái</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Người tạo</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Cập nhật lần cuối</TableCell>
  //               <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {Array.from({ length: 3 }).map((_item, index) => (
  //               <TableRow key={index}>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="text" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="text" width={350} height={32} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align="center">
  //                   <Skeleton variant="text" width={70} height={40} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="rectangular" width={50} height={26} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="rectangular" width={85} height={32} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center' className='font-[700] '>
  //                   <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="rectangular" width={150} height={40} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //                 <TableCell align='center'>
  //                   <Skeleton variant="rectangular" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
  //                 </TableCell>
  //               </TableRow>
  //             ))}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     )
  //   }

  return (
    <>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #757575', // đường kẻ
            fontSize: '14px'
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
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Tên đơn hàng</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Thanh toán</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Người đặt hàng</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#003459', color: 'white' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          {orders && orders.length > 0 ? (
            <>
              <TableBody>
                {orders
                  .map((order, index) => (
                    <TableRow key={index}>
                      <TableCell align='center'>
                        <Checkbox
                          checked={selectedIds.includes(order._id)}
                          onChange={(event) => handleCheckbox(order._id, event.target.checked)}
                          {...label}
                          size="small"
                          sx={{ padding: 0 }}
                          value={order._id}
                        />
                      </TableCell>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell>
                        <div className='flex flex-col items-center justify-center gap-[5px]'>
                          {order && (
                            order.products.map((product, index) => (
                              <div key={index} className='flex items-center justify-between gap-[10px]'>
                                <div>
                                  <img src={product.thumbnail} className='w-[100px] h-[100px]'/>
                                </div>
                                <div className='flex flex-col justify-center'>
                                  <div>
                                    {product.title}
                                  </div>
                                  <div>
                                    <b>Giá tiền: </b>
                                    {product.price.toLocaleString()}đ
                                  </div>
                                  <div>
                                    <b>Số lượng: </b>
                                    {product.quantity}
                                  </div>
                                  <div>
                                    <b>Mã giảm: </b>
                                    {product.discountPercentage}%
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        {Math.floor(getTotalBill(order)).toLocaleString()}đ
                      </TableCell>
                      <TableCell align='center'>
                        <button
                          onClick={() => handleToggleStatus(order._id, order.status)}
                          className={`border rounded-[5px] p-[5px] text-white
                          ${order.status === 'confirmed' ? 'bg-[#607D00]' : 'bg-[#BC3433]'}`}
                        >
                          {order.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                        </button>
                      </TableCell>
                      <TableCell align='center' className='font-[700] '>
                        <div className='flex flex-col gap-[10px]'>
                          <span>{order.userInfo.fullName}</span>
                          <span>{order.userInfo.phone}</span>
                          <span>{order.userInfo.address}</span>
                        </div>
                      </TableCell>
                      <TableCell align='center'>
                        {/* {(() => {
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
                        })()} */}
                        Cap nhat lan cuoi
                      </TableCell>
                      <TableCell align='center'>
                        <Link
                          to={`/admin/products/detail/${order._id}`}
                          className='nav-link border rounded-[5px] bg-[#757575] p-[5px] text-white'
                        >
                          Chi tiết
                        </Link>
                        <Link
                          to={`/admin/products/edit/${order._id}`}
                          className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                        >
                          Sửa
                        </Link>
                        <button
                        //   onClick={() => handleOpen(order._id)}
                          className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                        >
                          Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              {/* <Dialog
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
              </Dialog> */}
            </>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ fontWeight: '500', fontSize: '17px' }}>
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default OrderTable