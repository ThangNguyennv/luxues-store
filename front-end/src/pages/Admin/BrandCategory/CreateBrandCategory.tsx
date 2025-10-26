/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrandCategoryAPI } from '~/apis/admin/brandCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

const CreateBrandCategory = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('active')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await createBrandCategoryAPI({ title, status } as any)
      if (res.code === 201) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        navigate('/admin/brands-category')
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Tạo mới thất bại', severity: 'error' } })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo mới Danh mục Thương hiệu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
        <TextField
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value={'active'}>Hoạt động</MenuItem>
            <MenuItem value={'inactive'}>Không hoạt động</MenuItem>
          </Select>
        </FormControl>
        <div className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">Tạo mới</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/brands-category')}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateBrandCategory
