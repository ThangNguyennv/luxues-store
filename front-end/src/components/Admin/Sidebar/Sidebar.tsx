import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MdDashboard } from 'react-icons/md'
import { MdCategory } from 'react-icons/md'
import { FaProductHunt } from 'react-icons/fa'
import { FaCodeBranch } from 'react-icons/fa'
import { MdArticle } from 'react-icons/md'
import { FaCriticalRole } from 'react-icons/fa'
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import { IoIosSettings } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'
import { BiMenuAltRight } from 'react-icons/bi'
import { IoMenu } from 'react-icons/io5'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenAccount, setIsOpenAccount] = useState(false)
  const [isOpenSetting, setIsOpenSetting] = useState(false)
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const [isOpenProduct, setIsOpenProduct] = useState(false)
  const [isOpenBranch, setIsOpenBranch] = useState(false)
  const [isOpenArticle, setIsOpenArticle] = useState(false)
  const [isOpenRole, setIsOpenRole] = useState(false)
  const [isOpenDashboard, setIsOpenDashboard] = useState(false)

  return (
    <div
      className={`
        transition-all duration-500
        ${isOpen ? 'w-[200px]' : 'w-[70px]'}
        border rounded-[12px]
        flex flex-col gap-[20px]
        shadow:md bg-[#192335] p-[20px]
        text-[15px] font-[500] text-[#EFF2F2]
        h-screen fixed top-[80px] left-0 z-40
      `}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center text-[20px] cursor-pointer ${isOpen ? 'justify-end' : 'justify-center'} mb-[10px]`}
      >
        {isOpen ? <BiMenuAltRight /> : <IoMenu />}
      </button>
      {/* Menu */}
      {/* Tổng quan */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenDashboard(true)}
        onMouseLeave={() => setIsOpenDashboard(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <MdDashboard className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Tổng quan</p>
              <span>{isOpenDashboard ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenDashboard ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/dashboard'}>Doanh thu</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/orders'}>Danh sách đơn hàng</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết tổng quan */}

      {/* Danh mục */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenCategory(true)}
        onMouseLeave={() => setIsOpenCategory(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <MdCategory className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Danh mục</p>
              <span>{isOpenCategory ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenCategory ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/products-category'}>Danh mục trang phục</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/accessories-category'}>Danh mục phụ kiện</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết danh mục */}

      {/* Sản phẩm */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenProduct(true)}
        onMouseLeave={() => setIsOpenProduct(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <FaProductHunt className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Sản phẩm</p>
              <span>{isOpenProduct ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenProduct ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/products'}>Danh sách trang phục</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/accessories'}>Danh sách phụ kiện</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết sản phẩm */}

      {/* Thương hiệu */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenBranch(true)}
        onMouseLeave={() => setIsOpenBranch(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <FaCodeBranch className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Thương hiệu</p>
              <span>{isOpenBranch ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenBranch ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/brands-category'}>Danh mục thương hiệu</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/brands'}>Danh sách thương hiệu</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết thương hiệu */}

      {/* Bài viết */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenArticle(true)}
        onMouseLeave={() => setIsOpenArticle(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <MdArticle className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Bài viết</p>
              <span>{isOpenArticle ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenArticle ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/articles-category'}>Danh mục bài viết</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/articles'}>Danh sách bài viết</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết bài viết */}

      {/* Quyền */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenRole(true)}
        onMouseLeave={() => setIsOpenRole(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <FaCriticalRole className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Quyền</p>
              <span>{isOpenRole ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenRole ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/roles'}>Nhóm quyền</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/roles/permissions'}>Phân quyền</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết quyền */}

      {/* Tài khoản */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenAccount(true)}
        onMouseLeave={() => setIsOpenAccount(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <MdOutlineSupervisorAccount className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Tài khoản</p>
              <span>{isOpenAccount ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenAccount ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/accounts'}>Tài khoản Admin</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/users'}>Tài khoản người dùng</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Hết tài khoản */}

      {/* Cài đặt */}
      <div
        className='flex flex-col text-white cursor-pointer'
        onMouseEnter={() => setIsOpenSetting(true)}
        onMouseLeave={() => setIsOpenSetting(false)}
      >
        <div className='flex justify-between items-center p-[5px]'>
          <IoIosSettings className='text-[20px]'/>
          {isOpen && (
            <>
              <p>Cài đặt</p>
              <span>{isOpenSetting ? <FaChevronUp /> : <FaChevronDown />}</span>
            </>
          )}
        </div>
        <div
          className={`
            overflow-hidden transition-all duration-700 ease-in-out
            ${isOpenSetting ? 'max-h-40 mt-2' : 'max-h-0'}
          `}
        >
          <ul className="flex flex-col gap-2">
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/settings/general'}>Cài đặt chung</Link>
            </li>
            <li className="border-b border-[#9D9995] pb-[7px]">
              <Link to={'/admin/settings/advance'}>Cài đặt nâng cao</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Hết cài đặt */}

      {/* Thùng rác */}
      <div className="">
        <Link to={'/admin/trash'} className="flex items-center justify-between p-[5px]">
          <FaTrash className='text-[18px]'/>
          {isOpen && (
            <span>Thùng rác</span>
          )}
          <FaTrash className='text-[18px]'/>
        </Link>
      </div>
      {/* Hết thùng rác */}
      {/* Hết menu */}
    </div>
  )
}

export default Sidebar