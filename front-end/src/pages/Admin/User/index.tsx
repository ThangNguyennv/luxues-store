import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchChangeStatusAPI, fetchDeleteUserAPI, fetchUsersAPI } from '~/apis/admin/user.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { UserInfoInterface, UsersDetailInterface } from '~/types/user.type'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import { useAuth } from '~/contexts/admin/AuthContext'

const User = () => {
  const [users, setUsers] = useState<UserInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { role } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: UsersDetailInterface = await fetchUsersAPI()
        setUsers(res.users)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(id, newStatus)
    if (response.code === 200) {
      setUsers((prev) => prev.map((user) => user._id === id ? {
        ...user,
        status: newStatus
      }: user))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedId) return
    const response = await fetchDeleteUserAPI(selectedId)
    if (response.code === 204) {
      setUsers((prev) => prev.filter((item) => item._id != selectedId))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-[10px] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]'>
        <Skeleton variant="text" width={230} height={32} sx={{ bgcolor: 'grey.400' }}/>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader sx={{
            borderCollapse: 'collapse',
            '& th, & td': {
              border: '1px solid #000000', // đường kẻ,
              zIndex: 1
            },
            '& th': {
              backgroundColor: '#252733', // nền header
              color: '#fff',
              zIndex: 2,
              borderTop: '1px solid #000000 !important',
              borderBottom: '1px solid #000000 !important'
            }
          }}>
            <TableHead>
              <TableRow className='bg-gray-100'>
                <TableCell align='center'>STT</TableCell>
                <TableCell align='center'>Avatar</TableCell>
                <TableCell align='center'>Họ và tên</TableCell>
                <TableCell align='center'>Email</TableCell>
                <TableCell align='center'>Số điện thoại</TableCell>
                <TableCell align='center'>Trạng thái</TableCell>
                <TableCell align='center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 4 }).map((_item, index) => (
                <TableRow key={index}>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={20} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="circular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="rectangular" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    <div className='flex items-center justify-center'>
                      <Skeleton variant="rectangular" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }

  return (
    <>
      {role && role.permissions.includes('users_view') && (
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md mt-[15px]'>
          <h1 className="text-[24px] font-[700] text-[#000000]">Danh sách khách hàng</h1>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{
              borderCollapse: 'collapse',
              '& th, & td': {
                border: '1px solid #000000', // đường kẻ,
                zIndex: 1
              },
              '& th': {
                backgroundColor: '#252733', // nền header
                color: '#fff',
                zIndex: 2,
                borderTop: '1px solid #000000 !important',
                borderBottom: '1px solid #000000 !important'
              }
            }}>
              <TableHead>
                <TableRow className='bg-gray-100'>
                  <TableCell align='center'>STT</TableCell>
                  <TableCell align='center'>Avatar</TableCell>
                  <TableCell align='center'>Họ và tên</TableCell>
                  <TableCell align='center'>Email</TableCell>
                  <TableCell align='center'>Số điện thoại</TableCell>
                  <TableCell align='center'>Trạng thái</TableCell>
                  <TableCell align='center'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users ? (
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>
                        <div className='flex items-center justify-center'>
                          <img
                            src={user.avatar}
                            className='w-[100px] h-[100px] rounded-full object-cover'
                            alt="Avatar"
                          />
                        </div>
                      </TableCell>
                      <TableCell align='center'>{user.fullName}</TableCell>
                      <TableCell align='center'>{user.email}</TableCell>
                      <TableCell align='center'>{user.phone}</TableCell>
                      <TableCell align='center'>
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
                          ${user.status === 'active' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
                        >
                          {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </button>
                      </TableCell>
                      <TableCell align='center'>
                        <Link
                          to={`/admin/users/detail/${user._id}`}
                          className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                        >
                        Chi tiết
                        </Link>
                        <Link
                          to={`/admin/users/edit/${user._id}`}
                          className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                        >
                        Sửa
                        </Link>
                        <button
                          onClick={() => handleOpen(user._id)}
                          className='nav-link border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>
                        Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ fontWeight: '500', fontSize: '17px' }}>
                      Không có người dùng nào
                    </TableCell>
                  </TableRow>
                )}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="delete-dialog-title"
                >
                  <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                    Bạn có chắc chắn muốn xóa người dùng này không?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                    Xóa
                    </Button>
                  </DialogActions>
                </Dialog>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  )
}

export default User