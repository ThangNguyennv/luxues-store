/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react'
import { fetchProductAPI, fetchFilterstatusAPI, fetchPaginationAPI } from '~/apis/index'
import { useSearchParams } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
export interface ProductInterface {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number,
  thumbnail: string,
  stock: number,
  position: number,
  accountFullName: string
}

export interface FilterStatus {
  name: string,
  status: string,
  class?: string
}

export interface Pagination {
  currentPage: number,
  limitItems: number,
  skip: number,
  totalPage: number
}

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
  useEffect(() => {
    fetchFilterstatusAPI().then((filter: FilterStatus[]) => {
      setFilterStatus(filter)
    })
    fetchPaginationAPI().then((pagination: Pagination) => {
      setPagination(pagination)
    })
  }, [])
  const handleClick = (status: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (status) {
      newParams.set('status', status)
    } else {
      newParams.delete('status')
    }
    setSearchParams(newParams)
  }
  useEffect(() => {
    fetchProductAPI(currentStatus).then((products: ProductInterface[]) => {
      setProducts(products)
    })
  }, [currentStatus])
  return (
    <>
      <div>
        <h1 className='text-[30px] font-[700] text-[#000000]'>Danh sách sản phẩm</h1>
        <div className='text-[20px] font-[500] text-[#000000] p-[15px] border rounded-[5px] flex flex-col gap-[10px]'>
          <div>Bộ lọc và tìm kiếm</div>
          <div className='flex items-center justify-between text-[15px]'>
            <div className='flex gap-[15px] items-center'>
              {filterStatus.map(item => {
                const isActive = currentStatus === item.status
                return (
                  <button
                    onClick={() => handleClick(item.status)}
                    className={`p-[15px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] ${isActive ? 'bg-[#525FE1] border-[#525FE1]' : 'bg-white'}`}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
            <div></div>
          </div>
        </div>
        {/* <nav className='flex items-center justify-center p-[30px]'>
          <ul className='pagination flex items-center justify-center gap-[10px]'>
            <li>1</li>
          </ul>
        </nav> */}
        <TableContainer component={Paper}>
          <Table>
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
                  <TableCell align="center">{product.price.toLocaleString()}đ</TableCell>
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
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default ProductAdmin