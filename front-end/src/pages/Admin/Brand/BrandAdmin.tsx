/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchAllBrandsAPI, deleteBrandAPI } from '~/apis/admin/brand.api'
import type { Brand } from '~/types/brand.type'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const BrandAdmin = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)

  const loadBrands = async (currentPage = 1) => {
    setLoading(true)
    try {
      const res = await fetchAllBrandsAPI(currentPage)
      if (res.code === 200) {
        setBrands(res.brands)
        setPagination(res.pagination)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands(page)
  }, [page])

  const handleDelete = async () => {
    if (!selectedId) return
    try {
      const res = await deleteBrandAPI(selectedId)
      if (res.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        loadBrands(page)
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Xóa thất bại', severity: 'error' } })
    } finally {
      setOpenDeleteDialog(false)
      setSelectedId(null)
    }
  }

  const handleOpenDelete = (id: string) => {
    setSelectedId(id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedId(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Thương hiệu</h1>
        <Button
          component={Link}
          to="/admin/brands/create"
          variant="contained"
          color="primary"
        >
          Thêm mới
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Đang tải...</TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    <img src={brand.thumbnail} alt={brand.title} className="w-16 h-16 object-contain" />
                  </TableCell>
                  <TableCell>{brand.title}</TableCell>
                  <TableCell>
                    <span className={brand.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                      {brand.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <Button component={Link} to={`/admin/brands/edit/${brand._id}`} size="small" sx={{ mr: 1 }}>Sửa</Button>
                    <Button onClick={() => handleOpenDelete(brand._id!)} size="small" color="error">Xóa</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Pagination pagination={pagination} /> */}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent><DialogContentText>Bạn có chắc chắn muốn xóa thương hiệu này không?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy</Button>
          <Button onClick={handleDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BrandAdmin
