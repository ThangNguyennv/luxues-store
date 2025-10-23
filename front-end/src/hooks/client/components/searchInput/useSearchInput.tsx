import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export interface SearchInputProps {
  onSearchSubmit: () => void
  // eslint-disable-next-line no-unused-vars
  onTermChange: (term: string) => void
  isMobile?: boolean
}

const useSearchInput = ({ onSearchSubmit, onTermChange }: SearchInputProps) => {
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

    if (!window.location.pathname.startsWith('/search') && !window.location.pathname.startsWith('/products')) {
      navigate(`/search?${newParams.toString()}`)
    } else {
      setSearchParams(newParams)
    }
  }
  return {
    handleSubmit,
    handleChangeKeyword,
    inputValue
  }
}

export default useSearchInput

