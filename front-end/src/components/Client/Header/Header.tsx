import { IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import logo from '~/assets/images/Header/logo.png'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      {/* Top header */}
      <div className="bg-primary sm:py-[10px] py-[9px]">
        <div className="container mx-auto px-[16px]">
          <div className="flex">
            <div className="text-white flex-1 text-center sm:text-[14px] text-[12px]">
              <span className="font-[400]">Đăng ký để được giảm giá 20%.</span>
              <a className="font-[500] underline ml-[5px]" href="#">Đăng Ký Ngay</a>
            </div>
            <button className="text-white text-[14px] sm:inline-block hidden"><IoMdClose /></button>
          </div>
        </div>
      </div>
      {/* End Top header */}
      {/* Header */}
      <header className="sm:py-[24px] py-[20px] sticky top-0 bg-[#96D5FE] backdrop-blur-[45px] z-999">
        <div className="container mx-auto px-[16px]">
          <div className="flex items-center md:gap-x-[40px] gap-x-[16px]">
            <button className=" text-[20px] md:hidden inline">
              <FaBars />
            </button>
            <a
              className="flex items-center justify-between gap-[4px] font-[700] sm:text-[32px] text-[25px] text-primary lg:flex-none flex-1"
              href=""
            >
              <img
                src={logo}
                className='w-[50px] h-[50px] bg-amber-900'
              />
              LUXUES STORE
            </a>
            <nav className="md:block hidden">
              <ul className="menu flex gap-x-[24px] font-[400] text-[16px] text-black">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="">Trang phục</a></li>
                <li><a href="">Phụ kiện</a></li>
                <li><a href="">Thương hiệu</a></li>
                <li><a href="">Bài Viết</a></li>
              </ul>
            </nav>
            <form
              className="
                flex-1 lg:flex
                hidden items-center
                gap-x-[12px] px-[16px] py-[12px]
                bg-[#F0F0F0] rounded-[62px] text-[16px]"
              action="#"
            >
              <button className="text-[#00000066]">
                <IoSearch />
              </button>
              <input className="bg-transparent flex-1" type="" placeholder="Tìm kiếm sản phẩm..."/>
            </form>
            <div className="flex items-center gap-x-[14px] text-[21px]">
              <a className="lg:hidden inline" href="#">
                <IoSearch />
              </a>
              <a href="#">
                <IoMdCart />
              </a>
              <Link to={'/user/login'}>
                <FaRegUserCircle />
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* End Header */}
    </>
  )
}

export default Header