import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllBrandCategoriesAPI, deleteBrandCategoryAPI } from '~/apis/admin/brandCategory.api'
import type { BrandCategory } from '~/types/brand.type'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const BrandCategoryAdmin = () => {
  const [categories, setCategories] = useState<BrandCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { dispatchAlert } = useAlertContext()

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await fetchAllBrandCategoriesAPI()
      if (res.code === 200) {
        setCategories(res.categories)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleDelete = async () => {
    if (!selectedId) return
    try {
      const res = await deleteBrandCategoryAPI(selectedId)
      if (res.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        loadCategories() // Tải lại danh sách
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
        <h1 className="text-2xl font-bold">Quản lý Danh mục Thương hiệu</h1>
        <Button
          component={Link}
          to="/admin/brands-category/create"
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
              <TableCell>STT</TableCell>
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
              categories.map((category, index) => (
                <TableRow key={category._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.title}</TableCell>
                  <TableCell>
                    <span className={category.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                      {category.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <Button component={Link} to={`/admin/brands-category/edit/${category._id}`} size="small" sx={{ mr: 1 }}>Sửa</Button>
                    <Button onClick={() => handleOpenDelete(category._id!)} size="small" color="error">Xóa</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent><DialogContentText>Bạn có chắc chắn muốn xóa danh mục này không?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Hủy</Button>
          <Button onClick={handleDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BrandCategoryAdmin
