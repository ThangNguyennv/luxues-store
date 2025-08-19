import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPermissions, fetchRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { PermissionsInterface, RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'

const permissionSections = [
  {
    title: 'Danh sách đơn hàng',
    permissions: [
      { key: 'orders_view', label: 'Xem' },
      { key: 'orders_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh mục thời trang',
    permissions: [
      { key: 'products-category_view', label: 'Xem' },
      { key: 'products-category_create', label: 'Thêm mới' },
      { key: 'products-category_edit', label: 'Chỉnh sửa' },
      { key: 'products-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách thời trang',
    permissions: [
      { key: 'products_view', label: 'Xem' },
      { key: 'products_create', label: 'Thêm mới' },
      { key: 'products_edit', label: 'Chỉnh sửa' },
      { key: 'products_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh mục bài viết',
    permissions: [
      { key: 'articles-category_view', label: 'Xem' },
      { key: 'articles-category_create', label: 'Thêm mới' },
      { key: 'articles-category_edit', label: 'Chỉnh sửa' },
      { key: 'articles-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách bài viết',
    permissions: [
      { key: 'articles_view', label: 'Xem' },
      { key: 'articles_create', label: 'Thêm mới' },
      { key: 'articles_edit', label: 'Chỉnh sửa' },
      { key: 'articles_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Thùng rác',
    permissions: [
      { key: 'trashs_view', label: 'Xem' },
      { key: 'trashs_recover', label: 'Khôi phục' },
      { key: 'trashs_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Nhóm quyền',
    permissions: [
      { key: 'roles_view', label: 'Xem' },
      { key: 'roles_create', label: 'Thêm mới' },
      { key: 'roles_edit', label: 'Chỉnh sửa' },
      { key: 'roles_delete', label: 'Xóa' },
      { key: 'roles_permissions', label: 'Phân quyền' }
    ]
  },
  {
    title: 'Tài khoản admin',
    permissions: [
      { key: 'accounts_view', label: 'Xem' },
      { key: 'accounts_create', label: 'Thêm mới' },
      { key: 'accounts_edit', label: 'Chỉnh sửa' },
      { key: 'accounts_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Tài khoản người dùng',
    permissions: [
      { key: 'users_view', label: 'Xem' },
      { key: 'users_create', label: 'Thêm mới' },
      { key: 'users_edit', label: 'Chỉnh sửa' },
      { key: 'users_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Cài đặt chung',
    permissions: [
      { key: 'settings-general_view', label: 'Xem' }
    ]
  },
  {
    title: 'Cài đặt nâng cao',
    permissions: [
      { key: 'settings-advance_view', label: 'Xem' }
    ]
  }
]


const Permission = () => {
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const [permissionsData, setPermissionsData] = useState<PermissionsInterface[]>([])
  const { dispatchAlert } = useAlertContext()

  useEffect(() => {
    fetchRoleAPI().then((res: RolesResponseInterface) => {
      setRoles(res.roles)
      setPermissionsData(res.roles.map(role => ({ id: String(role._id), permissions: role.permissions || [] })))
    })
  }, [])

  const handleCheckboxChange = (roleIndex: number, permKey: string, checked: boolean) => {
    setPermissionsData((prev) => {
      return prev.map((item, index) => {
        if (index !== roleIndex) return item //  Không cùng role
        const newPermission = checked ? [...item.permissions, permKey] : item.permissions.filter(p => p !== permKey)
        return { ...item, permissions: newPermission } // ghi đè permissions mới
      })
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetchPermissions(permissionsData)
      if (response.code === 200) {
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
      }
    } catch (error) {
      alert('error'+ error)
    }
  }

  if (!roles || roles.length === 0) {
    return (
      <div>
        Chưa có nhóm quyền nào, vui lòng click vào tạo nhóm quyền để tạo nhóm quyền mới
        <br />
        <Link to="/admin/roles/create" className="border rounded-[5px] bg-[#525FE1] text-white p-[7px]">
          Đi tới tạo nhóm quyền
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className='text-[40px] font-[600] text-[#192335]'>Phân quyền</h1>
      {roles && roles.length > 0 && (
        <>
          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              className="cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px]"
            >
              Cập nhật
            </button>
          </div>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{
              borderCollapse: 'collapse',
              '& th, & td': {
                border: '1px solid #000000' // đường kẻ
              }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {roles.map((role, index) => (
                    <TableCell key={index} align='center'>{role.title}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {permissionsData.length > 0 && permissionSections.map((section, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell><b>{section.title}</b></TableCell>
                    </TableRow>
                    {section.permissions.map((permission, index) => (
                      <TableRow key={index}>
                        <TableCell>{permission.label}</TableCell>
                        {permissionsData.map((role, roleIndex) => (
                          <TableCell key={roleIndex} align="center">
                            <input
                              type="checkbox"
                              checked={role.permissions.includes(permission.key)}
                              onChange={(event) => handleCheckboxChange(roleIndex, permission.key, event.target.checked)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}

export default Permission