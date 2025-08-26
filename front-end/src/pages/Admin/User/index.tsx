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

const User = () => {
  const [users, setUsers] = useState<UserInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    fetchUsersAPI().then((response: UsersDetailInterface) => {
      setUsers(response.users)
    })
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

  const handleDeleteUser = async (id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa người dùng này?')
    const response = await fetchDeleteUserAPI(id)
    if (response.code === 204) {
      if (isConfirm) {
        setUsers((prev) => prev.filter((item) => item._id != id))
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
      }
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#000000]">Danh sách người dùng</h1>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #000000' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow className='bg-gray-100'>
              <TableCell>STT</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={user.avatar}
                      className='w-[150px] h-[150px] rounded-full object-cover'
                      alt="Avatar"
                    />
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(user._id, user.status)}
                      className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
                          ${user.status === 'active' ? 'bg-[#607D00]' : 'bg-[#BC3433]'}`}
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/users/detail/${user._id}`}
                      className='border rounded-[5px] bg-[#757575] p-[5px] text-white'
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`/admin/users/edit/${user._id}`}
                      className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className='cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>Xóa</button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default User