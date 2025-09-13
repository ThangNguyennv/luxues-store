import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDeleteRoleAPI, fetchRoleAPI } from '~/apis/admin/role.api'
import FormatDateTime from '~/components/admin/Moment/FormatDateTime'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { AccountInfoInterface } from '~/types/account.type'
import type { UpdatedBy } from '~/types/helper.type'
import type { RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'

const Role = () => {
  const [roles, setRoles] = useState<RolesInfoInterface[]>([])
  const [accounts, setAccounts] = useState<AccountInfoInterface[]>([])
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: RolesResponseInterface = await fetchRoleAPI()
        setRoles(res.roles)
        setAccounts(res.accounts)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Fetch roles error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
    const response = await fetchDeleteRoleAPI(selectedId)
    if (response.code === 204) {
      setRoles((prev) => prev.filter((role) => role._id !== selectedId))
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
      <>
        <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md mt-[40px]'>
          <h1 className="text-[24px] font-[700] text-[#000000]">Nhóm quyền</h1>
          <div className="flex items-center justify-end">
            <Link
              to={'/admin/roles/create'}
              className='border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] text-[#607D00] hover:bg-[#607D00] hover:text-white'
            >
          + Thêm mới
            </Link>
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
                  <TableCell align='center'>STT</TableCell>
                  <TableCell align='center'>Nhóm quyền</TableCell>
                  <TableCell align='center'>Mô tả ngắn</TableCell>
                  <TableCell align='center'>Cập nhật lần cuối</TableCell>
                  <TableCell align='center'>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 3 }).map((_item, index) => (
                  <TableRow key={index}>
                    <TableCell align='center'>
                      <Skeleton variant="rectangular" width={20} height={20} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                    <TableCell align='center'>
                      <Skeleton variant="text" width={110} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                    <TableCell align='center'>
                      <Skeleton variant="text" width={130} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                    <TableCell align='center'>
                      <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                    <TableCell align='center'>
                      <Skeleton variant="rectangular" width={150} height={32} sx={{ bgcolor: 'grey.400' }}/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='flex flex-col gap-[15px] bg-[#FFFFFF] p-[15px] shadow-md mt-[40px]'>
        <h1 className="text-[24px] font-[700] text-[#000000]">Nhóm quyền</h1>
        <div className="flex items-center justify-end">
          <Link
            to={'/admin/roles/create'}
            className='nav-link border rounded-[5px] px-[15px] py-[5px] border-[#607D00] font-[700] bg-[#607D00] text-white'
          >
          + Thêm mới
          </Link>
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
              <TableRow className='bg-gray-100'>
                <TableCell align='center'>STT</TableCell>
                <TableCell align='center'>Nhóm quyền</TableCell>
                <TableCell align='center'>Mô tả ngắn</TableCell>
                <TableCell align='center'>Cập nhật lần cuối</TableCell>
                <TableCell align='center'>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles && roles.length > 0 ? (
                roles.map((role, index) => (
                  <TableRow key={role._id}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center'>{role.title}</TableCell>
                    <TableCell align='center'>
                      <div dangerouslySetInnerHTML={{ __html: role.description }}/>
                    </TableCell>
                    <TableCell align='center'>{(() => {
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
                    <TableCell align='center'>
                      <Link
                        to={`/admin/roles/detail/${role._id}`}
                        className='nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white'
                      >
                          Chi tiết
                      </Link>
                      <Link
                        to={`/admin/roles/edit/${role._id}`}
                        className='nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'
                      >
                          Sửa
                      </Link>
                      <button
                        onClick={() => handleOpen(role._id)}
                        className='nav-link border rounded-[5px] bg-[#BC3433] p-[5px] text-white'
                      >
                          Xóa
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ fontWeight: '500', fontSize: '17px' }}>
                      Không có quyền nào
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
                    Bạn có chắc chắn muốn xóa quyền này không?
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
    </>
  )
}

export default Role