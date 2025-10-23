import { IoIosNotifications, IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { IoMdCart } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import { FaBars } from 'react-icons/fa'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Link } from 'react-router-dom'
import { IoLogOutOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { IoIosLogIn } from 'react-icons/io'
import { FaRegRegistered } from 'react-icons/fa'
import Skeleton from '@mui/material/Skeleton'
import SubMenu from '../SubMenu/SubMenu'
import { motion } from 'framer-motion'
import { IoChevronDown } from 'react-icons/io5'
import { RiBillLine } from 'react-icons/ri'
import SearchInput from './SearchInput'
import useHeader from '~/hooks/client/components/header/useHeader'

const Header = () => {
  const {
    loading,
    accountUser,
    closeTopHeader,
    handleCloseTopHeader,
    settingGeneral,
    setOpenProduct,
    openProduct,
    dataHome,
    setOpenArticle,
    handleSearchSubmit,
    handleSearchTermChange,
    openArticle,
    suggestions,
    scrollContainerRef,
    visibleCount,
    setSuggestions,
    isSuggestLoading,
    handleShowMore,
    cartDetail,
    handleOpen,
    handleClose,
    anchorEl,
    setAnchorEl,
    handleLogout
  } = useHeader()

  return (
    <>
      {loading && (
        <div className="bg-primary sm:py-[8px] py-[7px]">
          <div className="container mx-auto px-[16px]">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <Skeleton
                  variant="text"
                  width="60%"
                  height={20}
                  sx={{ bgcolor: 'rgba(255,255,255,0.3)', margin: '0 auto' }}
                  animation="wave"
                />
              </div>
              <Skeleton
                variant="circular"
                width={20}
                height={20}
                sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}
                animation="wave"
              />
            </div>
          </div>
        </div>
      )}

      {/* Top header */}
      {!loading && !accountUser && (
        <div className={`bg-primary sm:py-[8px] py-[7px] ${closeTopHeader ? 'hidden' : 'block'}`}>
          <div className="container mx-auto px-[16px]">
            <div className="flex">
              <div className="text-white flex-1 text-center sm:text-[14px] text-[12px]">
                <span className="font-[400]">Đăng ký để được giảm giá 20%.</span>
                <Link
                  className="font-[500] hover:underline ml-[5px]"
                  to="/user/register"
                >
                  Đăng Ký Ngay
                </Link>
              </div>
              <button
                onClick={handleCloseTopHeader}
                className="text-white text-[14px] sm:inline-block hidden cursor-pointer"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End Top header */}

      {/* Header */}
      <header className="sm:py-[24px] py-[19px] sticky top-0 bg-[#96D5FE] backdrop-blur-[45px] z-999">
        <div className="container mx-auto px-[16px]">
          <div className="flex items-center md:gap-x-[35px] gap-x-[16px]">
            <button className=" text-[20px] md:hidden inline">
              <FaBars />
            </button>
            <Link
              className="flex items-center justify-between gap-[4px] font-[700] sm:text-[30px] text-[27px] text-primary lg:flex-none flex-1"
              to={'/'}
            >
              {settingGeneral ? (
                <>
                  <img
                    alt="logo"
                    src={settingGeneral[0].logo}
                    className='w-[60px] h-[60px] bg-amber-900'
                  />
                  <span className='uppercase flex flex-col items-center'>
                    <p className='text-[#00171F]' style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>{settingGeneral[0].websiteName}</p>
                    <p className='text-[10px] font-bold text-[#0A033C]' style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>Lịch lãm - Sang trọng - Quý phái</p>
                  </span>
                </>
              ) : (
                <>
                  <Skeleton variant="rectangular" width={50} height={50} sx={{ bgcolor: 'grey.400' }}/>
                  <span className='uppercase flex flex-col items-center'>
                    <Skeleton variant="text" width={213} height={50} sx={{ bgcolor: 'grey.400' }}/>
                    <Skeleton variant="text" width={176} height={15} sx={{ bgcolor: 'grey.400' }}/>
                  </span>
                </>
              )}
            </Link>
            <nav className="md:block hidden">
              <ul className="menu flex gap-x-[17px] font-[400] text-[16px] text-black">
                <li>
                  <Link to="/">
                    Trang chủ
                  </Link>
                </li>
                <li
                  className='relative'
                  onMouseEnter={() => setOpenProduct(true)}
                  onMouseLeave={() => setOpenProduct(false)}
                >
                  <Link to={'/products'} className='flex items-center gap-[5px]'>
                    <span>Sản phẩm</span>
                    <IoChevronDown />
                  </Link>
                  {openProduct && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="absolute top-[20px] left-[-428px] p-[12px] w-[1527px] z-50">
                        {dataHome && dataHome.productCategories && (
                          <SubMenu
                            dataDropdown={
                              dataHome.productCategories.map((category) => ({
                                ...category,
                                slug: category.slug ?? '',
                                children: category.children
                                  ? category.children.map((sub) => ({
                                    ...sub,
                                    slug: sub.slug ?? '',
                                    children: sub.children
                                      ? sub.children.map((child) => ({
                                        ...child,
                                        slug: child.slug ?? ''
                                      }))
                                      : undefined
                                  }))
                                  : undefined
                              }))
                            }
                            items={'products'}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </li>
                <li>
                  <Link to={''} className='flex items-center gap-[5px]'>
                    <span>Phụ kiện</span>
                    <IoChevronDown />
                  </Link>
                </li>
                <li>
                  <Link to={''} className='flex items-center gap-[5px]'>
                    <span>Thương hiệu</span>
                    <IoChevronDown />
                  </Link>
                </li>
                <li
                  className='relative'
                  onMouseEnter={() => setOpenArticle(true)}
                  onMouseLeave={() => setOpenArticle(false)}
                >
                  <Link to={'/articles'} className='flex items-center gap-[5px]'>
                    <span>Bài Viết</span>
                    <IoChevronDown />
                  </Link>
                  {openArticle && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="absolute top-[20px] left-[-600px] p-[12px] w-[1527px] z-50">
                        {dataHome && dataHome.articleCategories && (
                          <SubMenu
                            dataDropdown={
                              dataHome.articleCategories.map((category) => ({
                                ...category,
                                slug: category.slug ?? '',
                                children: category.children
                                  ? category.children.map((sub) => ({
                                    ...sub,
                                    slug: sub.slug ?? '',
                                    children: sub.children
                                      ? sub.children.map((child) => ({
                                        ...child,
                                        slug: child.slug ?? ''
                                      }))
                                      : undefined
                                  }))
                                  : undefined
                              }))
                            }
                            items={'articles'}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </li>
              </ul>
            </nav>
            <div className="relative flex-1 lg:flex hidden">
              <SearchInput
                onSearchSubmit={handleSearchSubmit}
                onTermChange={handleSearchTermChange}
              />

              {/* === PHẦN HIỂN THỊ GỢI Ý === */}
              {suggestions.length > 0 && (
                <div
                  ref={scrollContainerRef}
                  className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-1000 p-4 max-h-[400px] overflow-y-auto"
                >
                  <div className="flex flex-col gap-4">
                    {/* Hiển thị sản phẩm theo visibleCount */}
                    {suggestions.slice(0, visibleCount).map(product => (
                      <Link
                        to={`/products/detail/${product.slug}`}
                        key={product._id}
                        className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md"
                        onClick={() => setSuggestions([])} // Ẩn gợi ý khi click
                      >
                        <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-contain border rounded" />
                        <div className="flex-1">
                          <p className="font-semibold line-clamp-2">{product.title}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-600 font-bold">
                              {Math.floor((product.price * (100 - product.discountPercentage)) / 100).toLocaleString('vi-VN')}đ
                            </span>
                            <span className="line-through text-gray-500">
                              {product.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {isSuggestLoading && <p className="text-center p-2">Đang tải...</p>}

                  {/* Nút "Xem thêm" */}
                  {visibleCount < suggestions.length && (
                    <div className="text-center mt-4">
                      <button
                        type='button'
                        onClick={handleShowMore}
                        className="text-blue-600 hover:underline"
                      >
                        Xem thêm {Math.min(4, suggestions.length - visibleCount)} sản phẩm
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-[20px] text-[26px]">
              <a className="lg:hidden inline" href="#">
                <IoSearch />
              </a>
              <a href='#'>
                <IoIosNotifications className='hover:text-[#00A7E6]'/>
              </a>
              <Link to={'/cart'} className='relative'>
                <IoMdCart className='hover:text-[#00A7E6]'/>
                {cartDetail && cartDetail.products.length > 0 ? (
                  <div className='absolute border rounded-[15px] text-center text-[13px] px-[5px] right-[-10px] top-[-10px] bg-amber-50'>
                    {cartDetail.products.length}
                  </div>
                ) : ''}
              </Link>
              {accountUser ? (
                <div
                  onMouseEnter={(event) => handleOpen(event)}
                  onMouseLeave={handleClose}
                  className='flex items-center justify-center gap-[5px]'
                >
                  <img src={accountUser.avatar} alt='Avatar' className='border rounded-[50%] w-[40px] h-[40px] cover'/>
                  <span className='text-[20px]'>{accountUser.fullName}</span>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        onMouseEnter: () => setAnchorEl(anchorEl), // giữ menu khi hover
                        onMouseLeave: handleClose // rời ra thì đóng
                      }
                    }}
                  >
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/account/info'} className='flex items-center justify-start gap-[10px]'>
                        <CgProfile />
                        <span>Tài khoản của tôi</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/my-orders'} className='flex items-center justify-start gap-[10px]'>
                        <RiBillLine />
                        <span>Đơn mua</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <div onClick={handleLogout} className='flex items-center justify-start gap-[10px]'>
                        <IoLogOutOutline />
                        <span>Đăng xuất</span>
                      </div>
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <div
                  onMouseEnter={(event) => handleOpen(event)}
                  onMouseLeave={handleClose}
                  className='flex items-center justify-center gap-[5px]'
                >
                  <FaRegUserCircle />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        onMouseEnter: () => setAnchorEl(anchorEl), // giữ menu khi hover
                        onMouseLeave: handleClose // rời ra thì đóng
                      }
                    }}
                  >
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/login'} className='flex items-center justify-start gap-[10px]'>
                        <IoIosLogIn />
                        <span>Đăng nhập</span>
                      </Link>
                    </MenuItem>
                    <MenuItem sx={{
                      '&:hover': {
                        backgroundColor: '#E0F2FE',
                        color: '#00A7E6'
                      }
                    }}>
                      <Link to={'/user/register'} className='flex items-center justify-start gap-[10px]'>
                        <FaRegRegistered />
                        <span>Đăng ký</span>
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* End Header */}
    </>
  )
}

export default Header