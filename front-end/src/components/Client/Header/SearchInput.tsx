// ~/components/client/Header/SearchInput.tsx

import { memo, useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IoSearch } from 'react-icons/io5'
interface SearchInputProps {
  onSearchSubmit: () => void
  // eslint-disable-next-line no-unused-vars
  onTermChange: (term: string) => void
}

const SearchInput = ({ onSearchSubmit, onTermChange }: SearchInputProps) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialKeyword = searchParams.get('keyword') || ''
  const [inputValue, setInputValue] = useState(initialKeyword)

  // Đồng bộ input với URL
  useEffect(() => {
    setInputValue(searchParams.get('keyword') || '')
  }, [searchParams])

  const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value
    // Cập nhật state cục bộ để input hiển thị ngay lập tức
    setInputValue(newTerm)
    // "Nói" cho cha mẹ biết giá trị mới là gì
    onTermChange(newTerm)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Set lại gợi ý sau khi đã submit
    onSearchSubmit()
    const newParams = new URLSearchParams(searchParams)
    if (inputValue) {
      newParams.set('keyword', inputValue)
    } else {
      newParams.delete('keyword')
    }
    newParams.set('page', '1')

    if (!window.location.pathname.startsWith('/search')) {
      navigate(`/search?${newParams.toString()}`)
    } else {
      setSearchParams(newParams)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex-1 lg:flex hidden
        items-center gap-x-[12px]
        px-[16px] py-[10px] bg-[#F0F0F0]
        rounded-[62px] text-[16px]"
    >
      <button type="submit" className="text-[#00000066]">
        <IoSearch />
      </button>
      <input
        onChange={handleChangeKeyword}
        className="bg-transparent flex-1"
        type="text"
        name="keyword"
        value={inputValue}
        placeholder="Tìm kiếm sản phẩm..."
        autoComplete="off"
      />
    </form>
  )
}

// Bọc component trong memo() để ngăn re-render không cần thiết
export default memo(SearchInput)