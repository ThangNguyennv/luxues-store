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
      <div className='border rounded-[5px] p-[5px] flex items-center justify-between'>
        <form onSubmit={handleSubmit}>
          <input onChange={(event) => handleChangeKeyword(event.target.value)} type="text" name="keyword" value={keyword} placeholder='Nhập từ khóa...' className='outline-none flex-1'/>
          <button type="submit" className='cursor-pointer p-[7px] bg-[#607D00] border rounded-[5px]'>Tìm</button>
        </form>
      </div>
    </>
  )
}

export default Search