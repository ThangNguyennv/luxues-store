
import { AlertToast } from '~/components/alert/Alert'
import { useEditMyAccount } from '~/hooks/admin/myAccount/useEdit'

const EditMyAccount = () => {
  const {
    accountInfo,
    setAccountInfo,
    password,
    setPassword,
    alertOpen,
    setAlertOpen,
    alertMessage,
    alertSeverity,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  } = useEditMyAccount()

  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
      <h1 className="text-[40px] font-[600] text-[#192335]">Chỉnh sửa thông tin cá nhân</h1>
      {accountInfo && (
        <form onSubmit={(event) => handleSubmit(event)} className="flex flex-col gap-[5px]" encType="multipart/form-data">
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="avatar"><b>Avatar</b></label>
            <input
              onChange={(event) => handleChange(event)}
              ref={uploadImageInputRef}
              type="file"
              className="border rounded-[5px] w-[5%] bg-[#DDDDDD] p-[5px]"
              name="avatar"
              accept="image/*"
            />
            <img
              ref={uploadImagePreviewRef}
              src={accountInfo.avatar}
              alt="Avatar preview"
              className="w-[150px] h-[150px]"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fullName"><b>Họ và tên</b></label>
            <input
              onChange={(event) =>
                setAccountInfo(accountInfo ? { ...accountInfo, fullName: event.target.value } : accountInfo)
              }
              type="text"
              className=""
              id="fullName"
              name="fullName"
              value={accountInfo.fullName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"><b>Email</b></label>
            <input onChange={(event) =>
              setAccountInfo(accountInfo ? { ...accountInfo, email: event.target.value }
                : accountInfo)
            }
            type="email"
            className=""
            id='email'
            name="email"
            value={accountInfo.email}
            required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone"><b>Số điện thoại</b></label>
            <input onChange={(event) =>
              setAccountInfo(accountInfo ? { ...accountInfo, phone: event.target.value }
                : accountInfo)
            }
            type="phone"
            className=""
            id='phone'
            name="phone"
            value={accountInfo.phone}
            />
            <div className="form-group">
              <label htmlFor="password"><b>Mật khẩu</b></label>
              <input
                onChange={(event) => setPassword(event.target.value)}
                type="text"
                className=""
                id='password'
                name="password"
                value={password}
              />
            </div>
          </div>
          <button type="submit" className=" cursor-pointer border rounded-[5px] bg-[#525FE1] text-white p-[7px]">Cập nhật</button>
        </form>
      )}
    </>
  )
}

export default EditMyAccount