/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBrandAPI } from '~/apis/admin/brand.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

const CreateBrand = () => {
  const navigate = useNavigate()
  const { dispatchAlert } = useAlertContext()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('active')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Vui lòng chọn logo', severity: 'error' } })
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('status', status)
    formData.append('thumbnail', file) // Backend nhận 'thumbnail'

    try {
      const res = await createBrandAPI(formData)
      if (res.code === 201) {
        dispatchAlert({ type: 'SHOW_ALERT', payload: { message: res.message, severity: 'success' } })
        navigate('/admin/brands')
      }
    } catch (error) {
      dispatchAlert({ type: 'SHOW_ALERT', payload: { message: 'Tạo mới thất bại', severity: 'error' } })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo mới Thương hiệu</h1>
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
        <div>
          <Button variant="contained" component="label">
            Chọn Logo
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {preview && <img src={preview} alt="Logo preview" className="w-32 h-32 object-contain mt-4 border" />}
        </div>
        <div className="flex gap-4">
          <Button type="submit" variant="contained" color="primary">Tạo mới</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/brands')}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateBrand
