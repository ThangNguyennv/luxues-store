import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPermissions, fetchRoleAPI } from '~/apis/admin/role.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { PermissionsInterface, RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { useAuth } from '~/contexts/admin/AuthContext'

const permissionSections = [
  {
    title: 'Danh sách đơn hàng',
    permissions: [
      { key: 'orders_view', label: 'Xem' },
      { key: 'orders_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh mục sản phẩm',
    permissions: [
      { key: 'products-category_view', label: 'Xem' },
      { key: 'products-category_create', label: 'Thêm mới' },
      { key: 'products-category_edit', label: 'Chỉnh sửa' },
      { key: 'products-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách sản phẩm',
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
    title: 'Danh mục thương hiệu',
    permissions: [
      { key: 'brands-category_view', label: 'Xem' },
      { key: 'brands-category_create', label: 'Thêm mới' },
      { key: 'brands-category_edit', label: 'Chỉnh sửa' },
      { key: 'brands-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách thương hiệu',
    permissions: [
      { key: 'brands_view', label: 'Xem' },
      { key: 'brands_create', label: 'Thêm mới' },
      { key: 'brands_edit', label: 'Chỉnh sửa' },
      { key: 'brands_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh mục phụ kiện',
    permissions: [
      { key: 'accessories-category_view', label: 'Xem' },
      { key: 'accessories-category_create', label: 'Thêm mới' },
      { key: 'accessories-category_edit', label: 'Chỉnh sửa' },
      { key: 'accessories-category_delete', label: 'Xóa' }
    ]
  },
  {
    title: 'Danh sách phụ kiện',
    permissions: [
      { key: 'accessories_view', label: 'Xem' },
      { key: 'accessories_create', label: 'Thêm mới' },
      { key: 'accessories_edit', label: 'Chỉnh sửa' },
      { key: 'accessories_delete', label: 'Xóa' }
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
  },
  {
    title: 'Thùng rác',
    permissions: [
      { key: 'trashs_view', label: 'Xem' },
      { key: 'trashs_recover', label: 'Khôi phục' },
      { key: 'trashs_delete', label: 'Xóa' }
    ]
  }
]


const Permission = () => {
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  console.log("🚀 ~ Permission.tsx ~ Permission ~ roles:", roles);
  const [permissionsData, setPermissionsData] = useState<PermissionsInterface[]>([])
  console.log("🚀 ~ Permission.tsx ~ Permission ~ permissionsData:", permissionsData);
  const { dispatchAlert } = useAlertContext()
  const [loading, setLoading] = useState(false)
  const { role } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: RolesResponseInterface = await fetchRoleAPI()
        setRoles(res.roles)
        setPermissionsData(res.roles.map(role => ({ _id: String(role._id), permissions: role.permissions || [] })))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
        setRoles(prev =>
          prev.map(role => {
            const updated = permissionsData.find(p => p._id === String(role._id))
            return updated ? { ...role, permissions: updated.permissions } : role
          })
        )
      }
    } catch (error) {
      alert('error'+ error)
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-[5px] bg-[#FFFFFF] p-[15px] shadow-md mt-[20px]'>
        <Skeleton variant="text" width={110} height={38} sx={{ bgcolor: 'grey.400' }}/>
        <div className='flex flex-col gap-[10px]'>
          <div className="flex items-center justify-end">
            <Skeleton variant="rectangular" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>
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
                <TableRow>
                  <TableCell sx={{
                    position: 'sticky',
                    width: 250,
                    height: 80,
                    backgroundImage: 'linear-gradient(to top right, transparent 49%, black 50%, transparent 51%)'
                  }}>
                    <Box sx={{ position: 'absolute', top: 40, left: 15 }}>
                      <Skeleton variant="text" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 30, right: 15 }}>
                      <Skeleton variant="text" width={90} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </Box>
                  </TableCell>
                  {Array.from({ length: 4 }).map((_item, index) => (
                    <TableCell key={index} align='center'>
                      <Skeleton variant="text" width={110} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 4 }).map((_item, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell sx={{ background: '#192335', color: 'white' }}>
                        <Skeleton variant="text" width={110} height={32} sx={{ bgcolor: 'grey.400' }}/>
                      </TableCell>
                    </TableRow>
                    {Array.from({ length: 2 }).map((_item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: '500' }}>
                          <Skeleton variant="text" width={50} height={32} sx={{ bgcolor: 'grey.400' }}/>
                        </TableCell>
                        {Array.from({ length: 4 }).map((_item, index) => (
                          <TableCell key={index} align="center">
                            <Skeleton variant="rectangular" width={13} height={13} sx={{ bgcolor: 'grey.400' }}/>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
  }

  return (
    <>
      {role && role.permissions.includes('roles_permissions') && (
        roles && roles.length > 0 ? (
          <div className='flex flex-col gap-[5px] bg-[#FFFFFF] p-[15px] shadow-md h-[800px] fixed w-[80%]'>
            <h1 className='text-[24px] font-[600] text-[#192335]'>Phân quyền</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className="flex items-center justify-end">
                <button
                  onClick={handleSubmit}
                  className="border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
                >
                  Cập nhật
                </button>
              </div>
              <TableContainer sx={{ maxHeight: 650 }}>
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
                    <TableRow>
                      <TableCell sx={{
                        position: 'sticky',
                        width: 250,
                        height: 80,
                        backgroundImage: 'linear-gradient(to top right, transparent 49%, black 50%, transparent 51%)'
                      }}>
                        <Box sx={{ position: 'absolute', top: 40, left: 15 }}>Phân loại</Box>
                        <Box sx={{ position: 'absolute', bottom: 30, right: 15 }}>Nhóm quyền</Box>
                      </TableCell>
                      {roles.map((role, index) => (
                        <TableCell key={index} align='center'>{role.title}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissionsData.length > 0 && permissionSections.map((section, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell sx={{ background: '#192335', color: 'white' }}>
                            <b>{section.title}</b>
                          </TableCell>
                        </TableRow>
                        {section.permissions.map((permission, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontWeight: '500' }}>{permission.label}</TableCell>
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
            </div>
          </div>
        ) : (
          <div>
            Chưa có nhóm quyền nào, vui lòng click vào tạo nhóm quyền để tạo nhóm quyền mới
            <br />
            <Link
              to="/admin/roles/create"
              className="nav-link border rounded-[5px] bg-[#525FE1] text-white p-[7px]"
            >
              Đi tới tạo nhóm quyền
            </Link>
          </div>
        )
      )}
    </>
  )
}

export default Permission