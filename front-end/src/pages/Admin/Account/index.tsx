import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAccountsAPI, fetchChangeStatusAPI } from '~/apis/admin/account.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountsDetailInterface, AccountInfoInterface } from '~/types/account.type'
import type { RolesInfoInterface } from '~/types/role.type'

const Account = () => {
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>([])
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    fetchAccountsAPI().then((response: AccountsDetailInterface) => {
      setAccounts(response.accounts)
      setRoles(response.roles)
    })
  }, [])

  const handleToggleStatus = async (_id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      setAccounts((prev) => prev.map((account) => account._id === _id ? {
        ...account,
        status: newStatus
      }: account))
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#000000]">Danh sách tài khoản</h1>

      <div className="flex items-center justify-end">
        <Link
          to={'/admin/accounts/create'}
          className="border rounded-[5px] px-[55px] py-[5px] border-[#607D00] font-[600] text-[#607D00] hover:bg-[#607D00] hover:text-white"
        >
          + Thêm mới
        </Link>
      </div>
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
              <TableCell>Phân quyền</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts && (
              accounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img src={account.avatar} className='w-[100px] h-[100px]'/>
                  </TableCell>
                  <TableCell>{account.fullName}</TableCell>
                  <TableCell>
                    {roles.map((role) => (
                      account.role_id === role._id ? role.title : ''
                    ))}
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(account._id, account.status)}
                      className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
                          ${account.status === 'active' ? 'bg-[#607D00]' : 'bg-[#BC3433]'}`}
                    >
                      {account.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/accounts/detail/${account._id}`}
                      className='border rounded-[5px] bg-[#757575] p-[5px] text-white'
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`/admin/accounts/edit/${account._id}`}
                      className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                    >
                      Sửa
                    </Link>
                    <button className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>Xóa</button>
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

export default Account