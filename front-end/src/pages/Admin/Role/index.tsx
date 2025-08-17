import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRoleAPI } from '~/apis/admin/role.api'
import FormatDateTime from '~/components/admin/Moment/FormatDateTime'
import type { AccountInfoInterface } from '~/types/account.type'
import type { UpdatedBy } from '~/types/helper.type'
import type { RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'

const Role = () => {
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>([])
  useEffect(() => {
    fetchRoleAPI().then((res: RolesResponseInterface) => {
      setRoles(res.roles)
      setAccounts(res.accounts)
    })
  }, [])

  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#000000]">Nhóm quyền</h1>

      <div className="text-[20px] font-[500] text-[#000000] p-[15px] border rounded-[5px] flex flex-col gap-[10px]">Danh sách nhóm quyền</div>
      <div className="flex items-center justify-end">
        <Link
          to={'/admin/roles/create'}
          className='border rounded-[5px] px-[55px] py-[5px] border-[#607D00] font-[600] text-[#607D00] hover:bg-[#607D00] hover:text-white'
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
              <TableCell>Nhóm quyền</TableCell>
              <TableCell>Mô tả ngắn</TableCell>
              <TableCell>Cập nhật lần cuối</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles && roles.length > 0 && (
              roles.map((role, index) => (
                <TableRow key={role._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.title}</TableCell>
                  <TableCell><div dangerouslySetInnerHTML={{ __html: role.description }} /></TableCell>
                  <TableCell>{(() => {
                    const updatedBy = role.updatedBy?.[(role.updatedBy as UpdatedBy[]).length - 1]
                    if (!updatedBy) {
                      return (
                        <>
                          <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
                        </>
                      )
                    }
                    if (Array.isArray(role.updatedBy) && role.updatedBy.length > 0) {
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
                  })()}</TableCell>
                  <TableCell>
                    <Link to={`/admin/roles/detail/${role._id}`} className='border rounded-[5px] bg-[#757575] p-[5px] text-white'>Chi tiết</Link>
                    <Link to={`/admin/roles/edit/${role._id}`} className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'>Sửa</Link>
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

export default Role