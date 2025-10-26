import { FaCheck } from 'react-icons/fa6'

const sortOptions = [
  { name: 'Mặc định (Nổi bật)', key: 'position', value: 'desc' },
  { name: 'Giá: Cao đến Thấp', key: 'discountedPrice', value: 'desc' },
  { name: 'Giá: Thấp đến Cao', key: 'discountedPrice', value: 'asc' },
  { name: 'Tên: A-Z', key: 'title', value: 'asc' },
  { name: 'Tên: Z-A', key: 'title', value: 'desc' }
]

// 2. Định nghĩa Props
interface SortDropdownProps {
  sortKey: string
  sortValue: string
  onSortChange: (key: string, value: string) => void
  isMobile?: boolean // Prop để thay đổi giao diện
}

export const SortDropdown = ({
  sortKey,
  sortValue,
  onSortChange,
  isMobile = false
}: SortDropdownProps) => {

  // 3. Tạo một giá trị duy nhất để quản lý state của dropdown
  const currentSortValue = `${sortKey}-${sortValue}`

  // 4. Hàm xử lý khi chọn
  const handleSelectChange = (selectedValue: string) => {
    const [key, value] = selectedValue.split('-')
    onSortChange(key, value)
  }

  // 5. Giao diện cho Mobile (dạng danh sách)
  if (isMobile) {
    return (
      <div className="flex flex-col gap-1">
        {sortOptions.map((option) => {
          const value = `${option.key}-${option.value}`
          const isActive = currentSortValue === value
          return (
            <button
              key={option.name}
              onClick={() => handleSelectChange(value)}
              className={`flex items-center justify-between p-4 rounded-lg w-full text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{option.name}</span>
              {isActive && <FaCheck />}
            </button>
          )
        })}
      </div>
    )
  }

  // 6. Giao diện cho Desktop (dạng dropdown)
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sắp xếp theo:
      </label>
      <select
        id="sort-select"
        value={currentSortValue}
        onChange={(e) => handleSelectChange(e.target.value)}
        className="rounded-md border border-gray-300 p-2 text-sm shadow-sm outline-none"
      >
        {sortOptions.map((option) => (
          <option
            key={option.name}
            value={`${option.key}-${option.value}`}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

