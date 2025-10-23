import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { fetchLogoutAPI } from '~/apis/client/auth.api'
import type { UserInfoInterface } from '~/types/user.type'
import { fetchInfoUserAPI } from '~/apis/client/user.api'
import { useSettingGeneral } from '~/contexts/client/SettingGeneralContext'
import { fetchSettingGeneralAPI } from '~/apis/client/settingGeneral.api'
import { fetchHomeAPI } from '~/apis/client/home.api'
import { useHome } from '~/contexts/client/HomeContext'
import { useCart } from '~/contexts/client/CartContext'
import type { ProductInfoInterface } from '~/types/product.type'
import { fetchSearchSuggestionsAPI } from '~/apis/client/product.api'

const useHeader = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [accountUser, setAccountUser] = useState<UserInfoInterface | null>(null)
  const [loading, setLoading] = useState(false)
  const [openProduct, setOpenProduct] = useState(false)
  const [openArticle, setOpenArticle] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<ProductInfoInterface[]>([])
  const [isSuggestLoading, setIsSuggestLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4) // Số lượng gợi ý hiển thị ban đầu
  const scrollContainerRef = useRef<HTMLDivElement>(null) // Tạo một ref để gắn vào div cuộn

  const { dispatchAlert } = useAlertContext()
  const { dataHome, setDataHome } = useHome()
  const { settingGeneral, setSettingGeneral } = useSettingGeneral()
  const { cartDetail } = useCart()

  const [closeTopHeader, setCloseTopHeader] = useState<boolean>(() => {
    // lấy từ sessionStorage khi khởi tạo
    const saved = sessionStorage.getItem('closeTopHeader')
    return saved === 'true'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [settingRes, userRes, homeRes] = await Promise.all([
          fetchSettingGeneralAPI(),
          fetchInfoUserAPI(),
          fetchHomeAPI()
        ])
        setSettingGeneral(settingRes.settingGeneral)
        setAccountUser(userRes.accountUser)
        setDataHome(homeRes)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error' + error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // === THÊM useEffect ĐỂ XỬ LÝ DEBOUNCE VÀ GỌI API GỢI Ý ===
  useEffect(() => {
    // Nếu không có từ khóa, xóa gợi ý và dừng lại
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    // Đặt một timer. Nếu người dùng tiếp tục gõ, timer cũ sẽ bị xóa.
    const delayDebounceFn = setTimeout(async () => {
      setIsSuggestLoading(true)
      try {
        const response = await fetchSearchSuggestionsAPI(searchTerm)
        if (response.code === 200) {
          setSuggestions(response.products)
          setVisibleCount(4) // Reset lại số lượng hiển thị mỗi khi có kết quả mới
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Lỗi khi fetch gợi ý:', error)
        setSuggestions([])
      } finally {
        setIsSuggestLoading(false)
      }
    }, 300) // Chờ 300ms sau khi người dùng ngừng gõ

    // Cleanup function: Xóa timer cũ mỗi khi inputValue thay đổi
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleSearchTermChange = (newTerm: string) => {
    setSearchTerm(newTerm)
  }

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    const response = await fetchLogoutAPI()
    if (response.code === 200) {
      sessionStorage.setItem('closeTopHeader', 'false')
      setCloseTopHeader(false)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setAccountUser(null)
      setTimeout(() => {
        navigate('/')
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }

  const handleCloseTopHeader = () => {
    setCloseTopHeader(true)
    sessionStorage.setItem('closeTopHeader', 'true')
  }

  const handleSearchSubmit = () => {
    setSuggestions([])
  }

  // Hàm để xử lý khi click vào "Xem thêm"
  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4)
  }

  // Dùng useEffect để xử lý việc cuộn sau khi state đã được cập nhật và component đã render lại
  useEffect(() => {
    // Cuộn xuống dưới cùng của div mỗi khi danh sách được mở rộng
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [visibleCount]) // Chạy lại mỗi khi visibleCount thay đổi

  return {
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
  }
}

export default useHeader