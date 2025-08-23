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

  return (
    <>
      <h1 className='text-[30px] font-[700] text-[#000000]'>Chỉnh sửa cài đặt chung</h1>

      {general && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className='flex flex-col gap-[10px]'
          encType="multipart/form-data"
        >
          <div className='form-group'>
            <label htmlFor='websiteName'>Tên website</label>
            <input
              onChange={(event) => setGeneral({ ...general, websiteName: event.target.value })}
              type='text'
              id='websiteName'
              name='websiteName'
              value={general.websiteName}
              required
            />
          </div>
          <div className='flex flex-col gap-[5px]'>
            <label htmlFor='logo'>Logo</label>
            <input
              onChange={(event) => handleChange(event)}
              ref={uploadImageInputRef}
              type='file'
              id='logo'
              name='logo'
              accept='image/*'
            />
            <img
              ref={uploadImagePreviewRef}
              src={general.logo}
              className='w-[150px] h-auto'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='phone'>Số điện thoại</label>
            <input
              onChange={(event) => setGeneral({ ...general, phone: event.target.value })}
              type='text'
              id='phone'
              name='phone'
              value={general.phone}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              onChange={(event) => setGeneral({ ...general, email: event.target.value })}
              type='email'
              id='email'
              name='email'
              value={general.email}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='address'>Địa chỉ</label>
            <input
              onChange={(event) => setGeneral({ ...general, address: event.target.value })}
              type='text'
              id='address'
              name='address'
              value={general.address}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='copyright'>Bản quyền</label>
            <input
              onChange={(event) => setGeneral({ ...general, copyright: event.target.value })}
              type='text'
              id='copyright'
              name='copyright'
              value={general.copyright}
              required
            />
          </div>
          <button
            type='submit'
            className='cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px] w-[7%]'
          >
            Cập nhật
          </button>
        </form>
      )}
    </>
  )
}

export default EditSettingGeneral