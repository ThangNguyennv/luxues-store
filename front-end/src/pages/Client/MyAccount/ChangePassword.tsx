import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchChangePasswordInfoUserAPI, fetchInfoUserAPI } from '~/apis/client/user.api'
import type { UserDetailInterface, UserInfoInterface } from '~/types/user.type'
import { useAlertContext } from '~/contexts/alert/AlertContext'

const ChangePassword = () => {
  const [myAccount, setMyAccount] = useState<UserInfoInterface | null>(null)
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  useEffect(() => {
    fetchInfoUserAPI().then((response: UserDetailInterface) => {
      setMyAccount(response.accountUser)
    })
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!myAccount) return

    const formData = new FormData(event.currentTarget)

    const response = await fetchChangePasswordInfoUserAPI(formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/user/account/info')
      }, 2000)
    } else if (response.code === 409) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'error' }
      })
    }
  }

  return (
    <>
      {myAccount && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className='w-[70%] flex items-center justify-center gap-[15px] border rounded-[15px] p-[10px]'
          encType="multipart/form-data"
        >
          <div className='flex flex-col w-[40%] gap-[15px]'>
            <h1 className='text-[25px] font-[600] text-center'>Thay đổi mật khẩu tài khoản</h1>
            <div className='flex flex-col gap-[10px]'>
              <div className='form-group'>
                <label htmlFor='currentPassword'>Mật khẩu hiện tại: </label>
                <input
                  type='password'
                  id='currentPassword'
                  name='currentPassword'
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Mật khẩu mới:</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='confirmPassword'>Xác nhận lại mật khẩu:</label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  required
                />
              </div>
              <button
                type='submit'
                className='cursor-pointer border rounded-[5px] p-[7px] bg-[#525FE1] text-white text-center w-[40%]'
              >
                    Cập nhật
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}

export default ChangePassword