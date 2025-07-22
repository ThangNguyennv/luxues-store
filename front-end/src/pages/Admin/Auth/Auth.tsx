const AuthAdmin = () => {
  return (
    <>
      <div className="flex items-center justify-center p-[100px] mt-[200px]">
        <div>
          <h1 className="text-center text-[30px] font-[600] text-[#231F40]">Đăng nhập</h1>
          <form className="border rounded-[5px] p-[25px] border-[#C366E7] flex flex-col gap-[15px]">
            <div>
              <label htmlFor='email' className="text-[15px] font-[500]">Email:</label>
              <input type="email" className="" name="email"/>
            </div>
            <div>
              <label htmlFor='password' className="text-[15px] font-[500]">Mật khẩu:</label>
              <input type="password" className="" name="password"/>
            </div>
            <button type="submit" className="p-[5px] border rounded-[5px] border-[#00171F] bg-[#00A7E6] text-white w-full">Đăng nhập</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AuthAdmin