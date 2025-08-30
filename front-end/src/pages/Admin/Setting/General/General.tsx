import Skeleton from '@mui/material/Skeleton'
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
      <h1 className='text-[24px] font-[700]'>Cài đặt chung</h1>
      {general ?(
        <div className='flex flex-col gap-[15px] mt-[20px]'>
          <div>
            <b className='text-[18px]'>Tên website: </b>
            <span className='text-[16px]'>{general.websiteName}</span>
          </div>
          <div className='flex flex-col gap-[10px]'>
            <b className='text-[18px]'>Logo: </b>
            <img
              src={general.logo}
              className='w-[150px] h-auto'
            />
          </div>
          <div>
            <b className='text-[18px]'>Số điện thoại: </b>
            <span className='text-[16px]'>{general.phone}</span>
          </div>
          <div>
            <b className='text-[18px]'>Email: </b>
            <span className='text-[16px]'>{general.email}</span>
          </div>
          <div>
            <b className='text-[18px]'>Địa chỉ: </b>
            <span className='text-[16px]'>{general.address}</span>
          </div>
          <div>
            <b className='text-[18px]'>Bản quyền: </b>
            <span className='text-[16px]'>{general.copyright}</span>
          </div>
          <Link
            to={'/admin/settings/general/edit'}
            className='cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[5px] w-[7%] text-center text-[16px]'
          >
            Chỉnh sửa
          </Link>
        </div>
      ) : (
        <>
          <Skeleton variant="text" width={200} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <div className='flex flex-col gap-[15px] mt-[20px]'>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        </>
      )}
    </>
  )
}

export default General