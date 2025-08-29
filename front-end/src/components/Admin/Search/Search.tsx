/* eslint-disable no-unused-vars */
interface Props {
    keyword: string,
    handleChangeKeyword: (value: string) => void
    handleSearch: (keyword: string) => void
}

const Search = ({ keyword, handleChangeKeyword, handleSearch }: Props) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    handleSearch(keyword)
  }

  return (
    <>
      <div className='border rounded-[5px] py-[7px] px-[9px] w-[30%]'>
        <form
          onSubmit={handleSubmit}
          className='flex items-center gap-[10px] w-full'
        >
          <input
            onChange={(event) => handleChangeKeyword(event.target.value)}
            type="text"
            name="keyword"
            value={keyword}
            placeholder='Nhập từ khóa...'
            className='outline-none flex-1'
          />
          <button
            type="submit"
            className='p-[5px] bg-[#00A7E6] border rounded-[5px]'
          >
            Tìm
          </button>
        </form>
      </div>
    </>
  )
}

export default Search