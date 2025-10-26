import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Component này tự động cuộn cửa sổ lên đầu (0, 0)
 * mỗi khi đường dẫn (pathname) thay đổi.
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Cuộn lên đầu trang
    window.scrollTo(0, 0)
  }, [pathname]) // Kích hoạt mỗi khi pathname thay đổi

  return null // Component này không render ra bất kỳ UI nào
}

export default ScrollToTop
