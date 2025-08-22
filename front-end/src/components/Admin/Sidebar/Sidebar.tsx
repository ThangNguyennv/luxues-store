import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { MdDashboard } from 'react-icons/md'
import { MdCategory } from 'react-icons/md'
import { FaProductHunt } from 'react-icons/fa'
import { FaCodeBranch } from 'react-icons/fa'
import { MdArticle } from 'react-icons/md'
import { FaCriticalRole } from 'react-icons/fa'
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import { IoIosSettings } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'

const Sidebar = () => {
  const [isOpenAccount, setIsOpenAccount] = useState(false)
  const [isOpenSetting, setIsOpenSetting] = useState(false)
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenProduct, setIsOpenProduct] = useState(false)
  const [isOpenBranch, setIsOpenBranch] = useState(false)
  const [isOpenArticle, setIsOpenArticle] = useState(false)
  const [isOpenRole, setIsOpenRole] = useState(false)
  const [isOpenDashboard, setIsOpenDashboard] = useState(false)

  return (
    <div className="sider w-[200px] bg-[#192335] p-[20px] text-[15px] font-[600] text-[#EFF2F2] h-screen fixed top-[80px] left-0 z-40">
      <div className="inner-menu">
        <ul className="flex flex-col gap-[10px] text-[#F9F9FF] font-[500]">

          {/* Tổng quan */}
          <button
            onClick={() => setIsOpenDashboard(!isOpenDashboard)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <MdDashboard />
            Tổng quan
            <span>{isOpenDashboard ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenDashboard ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/dashboard'}>Doanh thu</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/orders'}>Danh sách đơn hàng</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết tổng quan */}

          {/* Danh mục */}
          <button
            onClick={() => setIsOpenCategory(!isOpenCategory)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <MdCategory />
            Danh mục
            <span>{isOpenCategory ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenCategory ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/products-category'}>Danh mục trang phục</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/accessories-category'}>Danh mục phụ kiện</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết danh mục */}

          {/* Sản phẩm */}
          <button
            onClick={() => setIsOpenProduct(!isOpenProduct)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <FaProductHunt />
            Sản phẩm
            <span>{isOpenProduct ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenProduct ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/products'}>Danh sách trang phục</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/accessories'}>Danh sách phụ kiện</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết sản phẩm */}

          {/* Thương hiệu */}
          <button
            onClick={() => setIsOpenBranch(!isOpenBranch)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <FaCodeBranch />
            Thương hiệu
            <span>{isOpenBranch ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenBranch ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/brands-category'}>Danh mục thương hiệu</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/brands'}>Danh sách thương hiệu</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết thương hiệu */}

          {/* Bài viết */}
          <button
            onClick={() => setIsOpenArticle(!isOpenArticle)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <MdArticle />
            Bài viết
            <span>{isOpenArticle ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenArticle ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/articles-category'}>Danh mục bài viết</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/articles'}>Danh sách bài viết</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết bài viết */}

          {/* Quyền */}
          <button
            onClick={() => setIsOpenRole(!isOpenRole)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <FaCriticalRole />
            Quyền
            <span>{isOpenRole ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenRole ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/roles'}>Nhóm quyền</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/roles/permissions'}>Phân quyền</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết quyền */}

          {/* Tài khoản */}
          <button
            onClick={() => setIsOpenAccount(!isOpenAccount)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <MdOutlineSupervisorAccount />
            Tài khoản
            <span>{isOpenAccount ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenAccount ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/accounts'}>Tài khoản Admin</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/users'}>Tài khoản người dùng</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết tài khoản */}

          {/* Cài đặt */}
          <button
            onClick={() => setIsOpenSetting(!isOpenSetting)}
            className='w-full flex justify-between items-center p-2 text-white rounded cursor-pointer'
          >
            <IoIosSettings />
            Cài đặt
            <span>{isOpenSetting ? <FaChevronUp /> : <FaChevronDown />}</span>
          </button>
          <div
            className={`
          overflow-hidden transition-all duration-300 
          ${isOpenSetting ? 'max-h-40 mt-2' : 'max-h-0'}
        `}
          >
            <ul className="flex flex-col gap-2">
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/settings/general'}>Cài đặt chung</NavLink>
              </li>
              <li className="border-b border-[#9D9995] pb-[7px]">
                <NavLink to={'/admin/settings/advance'}>Cài đặt nâng cao</NavLink>
              </li>
            </ul>
          </div>
          {/* Hết cài đặt */}

          {/* Thùng rác */}
          <li className="border-b border-[#9D9995] pb-[7px]">
            <NavLink to={'/admin/trash'} className="flex items-center gap-[35px]">
              <FaTrash />
              <span>Thùng rác</span>
            </NavLink>
          </li>
          {/* Hết thùng rác */}

        </ul>
      </div>
    </div>
  )
}

export default Sidebar