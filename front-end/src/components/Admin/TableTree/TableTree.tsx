/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TableRow, TableCell, Checkbox } from '@mui/material'
import FormatDateTime from '../Moment/Moment'
import { Link } from 'react-router-dom'
import type { AccountInfoInterface, ProductCategoryDetailInterface } from '../Types/Interface'

interface ProductRowProps {
  product: ProductCategoryDetailInterface
  level: number
  selectedIds: string[]
  accounts: AccountInfoInterface[]
  handleCheckbox: (id: string, checked: boolean) => void
  handleToggleStatus: (id: string, status: string, updatedBy: { length: number; account_id: string; updatedAt: Date }) => void
  handleDeleteProduct: (id: string) => void
  setProducts: React.Dispatch<React.SetStateAction<ProductCategoryDetailInterface[]>>
  products: ProductCategoryDetailInterface[]
}

const ProductRow = ({
  product,
  level,
  selectedIds,
  accounts,
  handleCheckbox,
  handleToggleStatus,
  handleDeleteProduct,
  setProducts,
  products
}: ProductRowProps) => {
  const prefix = '— '.repeat(level)

  const updated = product.updatedBy?.at(-1)
  const creator = accounts.find((acc) => acc._id === product.createdBy?.account_id)
  const updater = accounts.find((acc) => acc._id === updated?.account_id)

  return (
    <>
      <TableRow key={product._id}>
        <TableCell align="center">
          <Checkbox
            checked={selectedIds.includes(product._id)}
            onChange={(e) => handleCheckbox(product._id, e.target.checked)}
            size="small"
            sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell align="center">{/* STT sẽ xử lý ngoài */}</TableCell>
        <TableCell align="center">{prefix}{product.title}</TableCell>
        <TableCell align="center">
          <div className="flex justify-center items-center">
            <img src={product.thumbnail} alt={product.title} className="w-[150px] h-[150px]" />
          </div>
        </TableCell>
        <TableCell align="center">
          <input
            type="number"
            value={product.position}
            min="1"
            onChange={(e) => {
              const newPosition = parseInt(e.target.value, 10)
              setProducts(products.map((p) =>
                p._id === product._id ? { ...p, position: newPosition } : p
              ))
            }}
            className="border rounded-[5px] border-[#00171F] w-[50px] p-[2px]"
          />
        </TableCell>
        <TableCell align="center">
          <button
            onClick={() => handleToggleStatus(product._id, product.status, product.updatedBy?.[product.updatedBy.length - 1])}
            className={`cursor-pointer border rounded-[5px] p-[5px] text-white ${product.status === 'active' ? 'bg-[#607D00]' : 'bg-[#BC3433]'}`}
          >
            {product.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </button>
        </TableCell>
        <TableCell align="center">
          {creator ? (
            <>
              <p className="text-sm font-medium text-gray-800">{creator.fullName}</p>
              <FormatDateTime time={product.createdBy?.createdAt} />
            </>
          ) : (
            <p className="text-sm italic text-gray-400">Không xác định</p>
          )}
        </TableCell>
        <TableCell align="center">
          {updated ? (
            updater ? (
              <>
                <p className="text-sm font-medium text-gray-800">{updater.fullName}</p>
                <FormatDateTime time={updated.updatedAt} />
              </>
            ) : (
              <p className="text-sm italic text-gray-400">Không xác định</p>
            )
          ) : (
            <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
          )}
        </TableCell>
        <TableCell align="center">
          <Link to={`/admin/products/detail/${product._id}`} className="border rounded-[5px] bg-[#757575] p-[5px] text-white">Chi tiết</Link>
          <Link to={`/admin/products/edit/${product._id}`} className="border rounded-[5px] bg-[#FFAB19] p-[5px] text-white">Sửa</Link>
          <button onClick={() => handleDeleteProduct(product._id)} className="border rounded-[5px] bg-[#BC3433] p-[5px] text-white">Xóa</button>
        </TableCell>
      </TableRow>
      {product.children?.map((child) => (
        <ProductRow
          key={child._id}
          product={child}
          level={level + 1}
          selectedIds={selectedIds}
          accounts={accounts}
          handleCheckbox={handleCheckbox}
          handleToggleStatus={handleToggleStatus}
          handleDeleteProduct={handleDeleteProduct}
          setProducts={setProducts}
          products={products}
        />
      ))}
    </>
  )
}

export default ProductRow