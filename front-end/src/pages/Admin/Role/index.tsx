import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRoleAPI } from '~/apis/admin/role.api'
import type { RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'
import { API_ROOT } from '~/utils/constants'

const Role = () => {
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  useEffect(() => {
    fetchRoleAPI().then((res: RolesResponseInterface) => {
      setRoles(res.roles)
    })
  }, [])

  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#000000]">Nhóm quyền</h1>

      <div className="text-[20px] font-[500] text-[#000000] p-[15px] border rounded-[5px] flex flex-col gap-[10px]">Danh sách</div>
      <div className="flex items-center justify-end">
        <Link to={`${API_ROOT}/roles/create`} className='border rounded-[5px] px-[55px] py-[5px] border-[#607D00] font-[600] text-[#607D00] hover:bg-[#607D00] hover:text-white'>+ Thêm mới</Link>
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
              roles.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Link to={`${API_ROOT}/roles/detail/${item._id}`} className='border rounded-[5px] bg-[#757575] p-[5px] text-white'>Chi tiết</Link>
                    <Link to={`${API_ROOT}/roles/edit/${item._id}`} className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'>Sửa</Link>
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