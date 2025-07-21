/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react'
import { fetchProductAllAPI } from '~/apis/index'
import { useSearchParams } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { PiGreaterThan } from 'react-icons/pi'
import { PiLessThan } from 'react-icons/pi'

interface ProductInterface {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number,
  thumbnail: string,
  stock: number,
  position: number,
  accountFullName: string
}

interface FilterStatus {
  name: string,
  status: string,
  class?: string
}

interface Pagination {
  currentPage: number,
  limitItems: number,
  skip: number,
  totalPage: number
}

export interface ProductAllResponse {
  products: ProductInterface[];
  filterStatus: FilterStatus[];
  pagination: Pagination;
}

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    fetchProductAllAPI(currentStatus, currentPage).then((res: ProductAllResponse) => {
      setProducts(res.products)
      setPagination(res.pagination)
      setFilterStatus(res.filterStatus)
    })
  }, [currentStatus, currentPage])
  const handleFilterStatus = (status: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (status) {
      newParams.set('status', status)
    } else {
      newParams.delete('status')
    }
    setSearchParams(newParams)
  }
  const handlePagination = (currentPage: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (currentPage) {
      newParams.set('page', currentPage)
    } else {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }
  const handlePaginationPrevious = (currentPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    if (currentPage) {
      newParams.set('page', (currentPage - 1).toString())
    } else {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }
  const handlePaginationNext = (currentPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    if (currentPage) {
      newParams.set('page', (currentPage + 1).toString())
    } else {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }
  return (
    <>
      <div className='flex flex-col gap-[15px]'>
        <h1 className='text-[30px] font-[700] text-[#000000]'>Danh sách sản phẩm</h1>
        <div className='text-[20px] font-[500] text-[#000000] p-[15px] border rounded-[5px] flex flex-col gap-[10px]'>
          <div>Bộ lọc và tìm kiếm</div>
          <div className='flex items-center justify-between text-[15px]'>
            {filterStatus && (
              <div className='flex gap-[15px] items-center'>
                {filterStatus.map((item, index) => {
                  const isActive = currentStatus === item.status
                  return (
                    <button
                      key={index}
                      onClick={() => handleFilterStatus(item.status)}
                      className={`cursor-pointer p-[15px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] ${isActive ? 'bg-[#525FE1] border-[#525FE1]' : 'bg-white'}`}
                    >
                      {item.name}
                    </button>
                  )
                })}
              </div>
            )}
            <div></div>
          </div>
        </div>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #ccc' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>STT</TableCell>
              <TableCell align='center'>Tên sản phẩm</TableCell>
              <TableCell align='center'>Hình ảnh</TableCell>
              <TableCell align="center">Giá</TableCell>
              <TableCell align='center'>Vị trí</TableCell>
              <TableCell align='center'>Trạng thái</TableCell>
              <TableCell align='center'>Người tạo</TableCell>
              <TableCell align='center'>Cập nhật lần cuối</TableCell>
              <TableCell align='center'>Hành động</TableCell>
            </TableRow>
          </TableHead>
          {products && (
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product._id}>
                  <TableCell align='center'>{index + 1}</TableCell>
                  <TableCell align='center'>{product.title}</TableCell>
                  <TableCell align='center'>
                    <div className='flex justify-center items-center '>
                      <img src={product.thumbnail} alt={product.title} className='w-[150px] h-[150px]'/>
                    </div>
                  </TableCell>
                  <TableCell align="center">${product.price.toLocaleString()}</TableCell>
                  <TableCell align='center'><input type='number' value={product.position} min={'1'} name='position' className='border rounded-[5px] border-[#00171F] w-[50px] p-[2px]'/></TableCell>
                  <TableCell align='center'>
                    <a className='border rounded-[5px] bg-[#607D00] p-[5px] text-white'>Hoạt động</a>
                  </TableCell>
                  <TableCell align='center'>{product.accountFullName}</TableCell>
                  <TableCell align='center'>{product.accountFullName}</TableCell>
                  <TableCell align='center'>
                    <a href='#' className='border rounded-[5px] bg-[#757575] p-[5px] text-white'>Chi tiết</a>
                    <a href='#' className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'>Sửa</a>
                    <a href='#' className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>Xóa</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {pagination && (
          <nav className='flex items-center justify-center p-[30px]'>
            <ul className='flex items-center justify-center gap-[10px]'>
              {pagination.currentPage > 1 && (
                <li>
                  <button onClick={() => handlePaginationPrevious(pagination.currentPage)} className='cursor-pointer'><PiLessThan /></button>
                </li>
              )}
              {[...Array(pagination.totalPage)].map((_item, index) => {
                const isActive = pagination.currentPage === (index + 1)
                return (
                  <li key={index}>
                    <button onClick={() => handlePagination((index + 1).toString())} className={`cursor-pointer p-[4px] border rounded-[4px] border-[#525FE1] hover:bg-[#525FE1] ${isActive ? 'bg-[#525FE1]' : 'bg-white'}`}>{index + 1}</button>
                  </li>
                )
              })}
              {pagination.currentPage < pagination.totalPage && (
                <li>
                  <button onClick={() => handlePaginationNext(pagination.currentPage)} className='cursor-pointer'><PiGreaterThan /></button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </>
  )
}

export default ProductAdmin