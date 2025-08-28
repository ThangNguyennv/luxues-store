
import { useEditMyAccount } from '~/hooks/admin/myAccount/useEdit'
import Skeleton from '@mui/material/Skeleton'

const EditMyAccount = () => {
  const {
    accountInfo,
    setAccountInfo,
    password,
    setPassword,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit,
    handleClick
  } = useEditMyAccount()

  return (
    <>
      {accountInfo ? (
        <>
          <h1 className="text-[30px] font-[600] text-[#192335]">Chỉnh sửa thông tin cá nhân</h1>
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[10px] w-[30%]"
            encType="multipart/form-data"
          >
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="avatar"><b>Avatar</b></label>
              <input
                onChange={(event) => handleChange(event)}
                ref={uploadImageInputRef}
                type="file"
                name="avatar"
                accept="image/*"
                className='hidden'
              />
              <button
                onClick={event => handleClick(event)}
                className="bg-[#9D9995] text-black font-[500] border rounded-[10px] w-[20%] py-[4px] cursor-pointer"
              >
              Chọn ảnh
              </button>
              <img
                ref={uploadImagePreviewRef}
                src={accountInfo.avatar}
                alt="Avatar preview"
                className="border rounded-[50%] w-[150px] h-[150px]"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fullName"><b>Họ và tên</b></label>
              <input
                onChange={(event) =>
                  setAccountInfo({ ...accountInfo, fullName: event.target.value })
                }
                type="text"
                className="py-[3px]"
                id="fullName"
                name="fullName"
                value={accountInfo.fullName}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email"><b>Email</b></label>
              <input onChange={(event) =>
                setAccountInfo({ ...accountInfo, email: event.target.value })
              }
              type="email"
              className="py-[3px]"
              id='email'
              name="email"
              value={accountInfo.email}
              required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone"><b>Số điện thoại</b></label>
              <input onChange={(event) =>
                setAccountInfo({ ...accountInfo, phone: event.target.value })
              }
              type="tel"
              id='phone'
              name="phone"
              value={accountInfo.phone}
              className="py-[3px]"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password"><b>Mật khẩu</b></label>
              <input
                onChange={(event) => setPassword(event.target.value)}
                type="text"
                id='password'
                name="password"
                className="py-[3px]"
                placeholder='Để trống nếu không muốn thay đổi mật khẩu'
                value={password}
              />
            </div>
            <button
              type="submit"
              className=" cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px] w-[25%] hover:opacity-80 transition-all duration-200 ease-in-out"
            >
            Cập nhật
            </button>
          </form>
        </>
      ) : (
        <>
          <Skeleton variant="text" width={350} height={35} sx={{ bgcolor: 'grey.400' }}/>
          <div className="flex flex-col gap-[10px] w-[30%]">
            <div className="flex flex-col gap-[5px]">
              <Skeleton variant="text" width={48} height={20} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={90} height={35} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="circular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="form-group">
              <Skeleton variant="text" width={70} height={20} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="form-group">
              <Skeleton variant="text" width={40} height={20} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="form-group">
              <Skeleton variant="text" width={97} height={20} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="form-group">
              <Skeleton variant="text" width={68} height={20} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={113} height={40} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        </>
      )}
    </>
  )
}

export default EditMyAccount