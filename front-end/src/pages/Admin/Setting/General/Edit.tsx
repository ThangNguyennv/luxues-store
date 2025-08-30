import Skeleton from '@mui/material/Skeleton'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchEditSettingGeneralAPI, fetchSettingGeneralAPI } from '~/apis/admin/settingGeneral.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { SettingGeneralDetailInterface, SettingGeneralInfoInterface } from '~/types/setting.type'

const EditSettingGeneral = () => {
  const [general, setGeneral] = useState<SettingGeneralInfoInterface | null>(null)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  useEffect(() => {
    fetchSettingGeneralAPI().then((response: SettingGeneralDetailInterface) => {
      setGeneral(response.settingGeneral[0])
    })
  }, [])

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!general) return
    const formData = new FormData(event.currentTarget)
    formData.set('websiteName', general.websiteName)
    formData.set('email', general.email)
    formData.set('phone', general.phone)
    formData.set('address', general.address)
    formData.set('copyright', general.copyright)

    const response = await fetchEditSettingGeneralAPI(formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/settings/general')
      }, 2000)
    } else if (response.code === 400) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return (
    <>
      {general ? (
        <>
          <h1 className='text-[24px] font-[700]'>Chỉnh sửa cài đặt chung</h1>
          <form
            onSubmit={(event) => handleSubmit(event)}
            className='flex flex-col gap-[15px] mt-[20px]'
            encType="multipart/form-data"
          >
            <div className='form-group'>
              <label htmlFor='websiteName' className='text-[18px] font-[600]'>Tên website</label>
              <input
                onChange={(event) => setGeneral({ ...general, websiteName: event.target.value })}
                type='text'
                id='websiteName'
                name='websiteName'
                className='border p-[5px] rounded-[5px] text-[14px]'
                value={general.websiteName}
                required
              />
            </div>
            <div className='flex flex-col gap-[5px]'>
              <label htmlFor='logo' className='text-[18px] font-[600]'>Logo</label>
              <input
                onChange={(event) => handleChange(event)}
                ref={uploadImageInputRef}
                type='file'
                id='logo'
                name='logo'
                className='hidden'
                accept='image/*'
              />
              <div className='flex flex-col gap-[10px]'>
                <button
                  onClick={event => handleClick(event)}
                  className="bg-[#9D9995] text-black font-[500] border rounded-[5px] w-[5%] py-[4px] cursor-pointer text-[14px]"
                >
              Chọn ảnh
                </button>
                <img
                  ref={uploadImagePreviewRef}
                  src={general.logo}
                  alt="Avatar preview"
                  className="w-[100px] h-[100px]"
                />
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='phone' className='text-[18px] font-[600]'>Số điện thoại</label>
              <input
                onChange={(event) => setGeneral({ ...general, phone: event.target.value })}
                type='text'
                id='phone'
                name='phone'
                className='border p-[5px] rounded-[5px] text-[14px]'
                value={general.phone}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email' className='text-[18px] font-[600]'>Email</label>
              <input
                onChange={(event) => setGeneral({ ...general, email: event.target.value })}
                type='email'
                id='email'
                name='email'
                className='border p-[5px] rounded-[5px] text-[14px]'
                value={general.email}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='address' className='text-[18px] font-[600]'>Địa chỉ</label>
              <input
                onChange={(event) => setGeneral({ ...general, address: event.target.value })}
                type='text'
                id='address'
                name='address'
                className='border p-[5px] rounded-[5px] text-[14px]'
                value={general.address}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='copyright' className='text-[18px] font-[600]'>Bản quyền</label>
              <input
                onChange={(event) => setGeneral({ ...general, copyright: event.target.value })}
                type='text'
                id='copyright'
                name='copyright'
                className='border p-[5px] rounded-[5px] text-[14px]'
                value={general.copyright}
                required
              />
            </div>
            <button
              type='submit'
              className='cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[5px] w-[7%] text-[16px]'
            >
            Cập nhật
            </button>
          </form>
        </>
      ) : (
        <>
          <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <form
            onSubmit={(event) => handleSubmit(event)}
            className='flex flex-col gap-[15px] mt-[15px]'
            encType="multipart/form-data"
          >
            <div className='form-group'>
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='flex flex-col gap-[5px]'>
              <Skeleton variant="text" width={77} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <div className='flex flex-col gap-[10px]'>
                <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
                <Skeleton variant="rectangular" width={100} height={100} sx={{ bgcolor: 'grey.400' }}/>
              </div>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className='form-group'>
              <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={108} height={36} sx={{ bgcolor: 'grey.400' }}/>
          </form>
        </>
      )}
    </>
  )
}

export default EditSettingGeneral