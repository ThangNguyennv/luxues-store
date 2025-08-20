import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSettingGeneralAPI } from '~/apis/admin/settingGeneral.api'

import type { SettingGeneralDetailInterface, SettingGeneralInfoInterface } from '~/types/setting.type'

const General = () => {
  const [general, setGeneral] = useState<SettingGeneralInfoInterface | null>(null)

  useEffect(() => {
    fetchSettingGeneralAPI().then((response: SettingGeneralDetailInterface) => {
      setGeneral(response.settingGeneral[0])
    })
  }, [])

  return (
    <>
      <h1 className='text-[30px] font-[700] text-[#000000]'>Cài đặt chung</h1>
      {general && (
        <>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Tên website: {general.websiteName}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Logo:
            <img
              src={general.logo}
              className='w-[150px] h-auto'
            />
          </h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Số điện thoại: {general.phone}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Email: {general.email}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Địa chỉ: {general.address}</h1>
          <h1 className='text-[35px] font-[600] text-[#00171F]'>Bản quyền: {general.copyright}</h1>
          <Link
            to={'/admin/settings/general/edit'}
            className='cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px] w-[7%] text-center'
          >
            Chỉnh sửa
          </Link>
        </>
      )}
    </>
  )
}

export default General