import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import type { ProductDetailInterface } from '../Types/Interface'
import { fetchChangeStatusAPI } from '~/apis'
import { useEffect, useState } from 'react'
import { AlertToast } from '~/components/Alert/Alert'
import { Link } from 'react-router-dom'

interface Props {
  listProducts: ProductDetailInterface[]
}

const ProductTableProps = ({ listProducts }: Props) => {
  const [products, setProducts] = useState<ProductDetailInterface[]>(listProducts)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')

  useEffect(() => {
    setProducts(listProducts)
  }, [listProducts])

  const handleToggleStatus = async (_id: string, currentStatus: string): Promise<void> => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, _id)
    if (response.code === 200) {
      setProducts((prevProducts: ProductDetailInterface[]) =>
        prevProducts.map((product) =>
          product._id === _id ? { ...product, status: newStatus } : product
        )
      )
      setAlertMessage('Đã cập nhật thành công trạng thái sản phẩm!')
      setAlertSeverity('success')
      setAlertOpen(true)
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
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
                  {product.status === 'active' ? (
                    <button onClick={() => handleToggleStatus(product._id, product.status)} className="cursor-pointer border rounded-[5px] bg-[#607D00] p-[5px] text-white">Hoạt động</button>
                  ) : (
                    <button onClick={() => handleToggleStatus(product._id, product.status)} className="cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white">Ngừng hoạt động</button>
                  )}
                </TableCell>
                <TableCell align='center'>{product.accountFullName}</TableCell>
                <TableCell align='center'>{product.accountFullName}</TableCell>
                <TableCell align='center'>
                  <Link to={`/admin/products/detail/${product._id}`} className='border rounded-[5px] bg-[#757575] p-[5px] text-white'>Chi tiết</Link>
                  <a href='#' className='border rounded-[5px] bg-[#FFAB19] p-[5px] text-white'>Sửa</a>
                  <a href='#' className='border rounded-[5px] bg-[#BC3433] p-[5px] text-white'>Xóa</a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  )
}

export default ProductTableProps