/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBrandCategoryDetailAPI, updateBrandCategoryAPI } from '~/apis/admin/brandCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material'
import type { BrandCategory } from '~/types/brand.type'

const EditBrandCategory = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [category, setCategory] = useState<BrandCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchBrandCategoryDetailAPI(id)
      .then(res => setCategory(res.category))
      .catch(() => dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Không tìm thấy danh mục', severity: 'error' } }))
      .finally(() => setLoading(false))
  }, [id, dispatchAlert])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string, value: string }
    setCategory(prev => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !category) return
    try {
      const res = await updateBrandCategoryAPI(id, category)
      if (res.code === 200) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        navigate('/admin/brands-category')
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Cập nhật thất bại', severity: 'error' } })
    }
  }

  if (loading) return <div className="p-6 flex justify-center"><CircularProgress /></div>

  if (!category) return <div className="p-6">Không tìm thấy danh mục.</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa Danh mục Thương hiệu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
        <TextField
          label="Tiêu đề"
          name="title"
          value={category.title}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status"
            value={category.status}
            label="Trạng thái"
            onChange={handleChange as any}
          >
            <MenuItem value={'active'}>Hoạt động</MenuItem>
            <MenuItem value={'inactive'}>Không hoạt động</MenuItem>
          </Select>
        </FormControl>
        <div className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">Cập nhật</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/brands-category')}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}

export default EditBrandCategory
