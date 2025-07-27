import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchLogoutAPI, fetchMyAccountAPI } from '~/apis'
import { AlertToast } from '~/components/Alert/Alert'
import { FaRegUserCircle } from 'react-icons/fa'
import type { AccountInfoInterface, AccountInterface } from '../Types/Interface'

const Header = () => {
  const navigate = useNavigate()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const [accountInfo, setAccountInfo] = useState<AccountInfoInterface | null>(null)

  useEffect(() => {
    fetchMyAccountAPI().then((res: AccountInterface) => {
      setAccountInfo(res.account)
    })
  }, [])

  const handleLogout = async (): Promise<void> => {
    try {
      const res = await fetchLogoutAPI()
      if (res.code === 200) {
        setAlertMessage('Đăng xuất thành công!')
        setAlertSeverity('success')
        setAlertOpen(true)
        setTimeout(() => {
          navigate('/admin/auth/login')
        })
      }
    } catch (error) {
      alert('Lỗi khi đăng xuất: ' + error)
    }
  }
  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
      <header className="bg-[#00171F] p-[20px] text-[25px] font-[700] text-[#EFF2F2] flex items-center justify-between">
        <a href="/admin/dashboard">ADMIN</a>
        <div className="flex items-center justify-center gap-[15px]">
          <Link to={'/admin/my-account'} className='flex items-center justify-between gap-[5px] cursor-pointer border rounded-[5px] p-[5px] text-[20px] font-[500] bg-[#01ADEF]'>
            <FaRegUserCircle /> {accountInfo ? accountInfo.fullName : 'Khách'}
          </Link>
          <a onClick={() => handleLogout()} className="cursor-pointer border rounded-[5px] p-[5px] text-[20px] font-[500] bg-[#BC3433]">Đăng xuất</a>
        </div>
      </header>
    </>
  )
}

export default Header