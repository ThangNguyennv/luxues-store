/* eslint-disable no-unused-vars */
interface Props {
    keyword: string,
    setKeyword: React.Dispatch<React.SetStateAction<string>>
    handleSearch: (keyword: string) => void
}

const Search = ({ keyword, setKeyword, handleSearch }: Props) => {
  return (
    <>
      <div className='border rounded-[5px] p-[5px] flex items-center justify-between'>
        <form onSubmit={(event) => {
          event.preventDefault()
          handleSearch(keyword)
        }}>
          <input onChange={(event) => setKeyword(event.target.value)} type="text" name="keyword" value={keyword} placeholder='Nhập từ khóa...' className='outline-none flex-1'/>
          <button type="submit" className='cursor-pointer p-[7px] bg-[#607D00] border rounded-[5px]'>Tìm</button>
        </form>
      </div>
    </>
  )
}

export default Search