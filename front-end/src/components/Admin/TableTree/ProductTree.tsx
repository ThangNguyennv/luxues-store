/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TableRow, TableCell, Checkbox } from '@mui/material'
import { Link } from 'react-router-dom'
import FormatDateTime from '../Moment/FormatDateTime'
import type { ProductCategoryActions, ProductCategoryInfoInterface } from '~/types/productCategory.type'
import type { AccountInfoInterface } from '~/types/account.type'

interface Props {
  productCategory: ProductCategoryInfoInterface
  level: number
  selectedIds: string[]
  accounts: AccountInfoInterface[]
  handleCheckbox: (_id: string, checked: boolean) => void
  handleToggleStatus: (_id: string, status: string) => void
  dispatchProductCategory: React.Dispatch<ProductCategoryActions>
  productCategories: ProductCategoryInfoInterface[]
  open: boolean
  handleOpen: (_id: string) => void
  handleClose: () => void
  handleDelete: () => void
}

const ProductTree = ({
  productCategory,
  level,
  selectedIds,
  accounts,
  handleCheckbox,
  handleToggleStatus,
  dispatchProductCategory,
  productCategories,
  open,
  handleOpen,
  handleClose,
  handleDelete
}: Props) => {
  const prefix = '— '.repeat(level)

  const updatedBy = productCategory.updatedBy.at(-1)
  const creator = accounts.find((account) => account._id === productCategory.createdBy.account_id)
  const updater = accounts.find((account) => account._id === updatedBy?.account_id)

  return (
    <>
      <TableRow key={productCategory._id}>
        <TableCell align="center" sx={{ padding: '0px 2px' }}>
          <Checkbox
            checked={selectedIds.includes(productCategory._id)}
            onChange={(e) => handleCheckbox(productCategory._id, e.target.checked)}
            size="small"
            sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell align="left">{prefix}{productCategory.title}</TableCell>
        <TableCell align="center" sx={{ padding: '10px 0px' }}>
          <div className="flex justify-center items-center">
            <img
              src={productCategory.thumbnail}
              alt={productCategory.title}
              className="w-[70px] h-[70px]"
            />
          </div>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <button
            onClick={() => handleToggleStatus(productCategory.status, productCategory._id)}
            className={`cursor-pointer border rounded-[5px] p-[5px] text-white 
              ${productCategory.status === 'active' ? 'bg-[#18BA2A]' : 'bg-[#BC3433]'}`}
          >
            {productCategory.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </button>
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          {creator ? (
            <>
              <p className="text-sm font-medium text-gray-800">{creator.fullName}</p>
              <FormatDateTime time={productCategory.createdAt} />
            </>
          ) : (
            <p className="text-sm italic text-gray-400">Không xác định</p>
          )}
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          {updatedBy ? (
            updater ? (
              <>
                <p className="text-sm font-medium text-gray-800">{updater.fullName}</p>
                <FormatDateTime time={updatedBy.updatedAt} />
              </>
            ) : (
              <p className="text-sm italic text-gray-400">Không xác định</p>
            )
          ) : (
            <p className="text-xs italic text-gray-400">Chưa có ai cập nhật</p>
          )}
        </TableCell>
        <TableCell align="center" sx={{ padding: '6px 0px' }}>
          <Link
            to={`/admin/products-category/detail/${productCategory._id}`}
            className="nav-link border rounded-[5px] bg-[#0542AB] p-[5px] text-white"
          >
            Chi tiết
          </Link>
          <Link
            to={`/admin/products-category/edit/${productCategory._id}`}
            className="nav-link border rounded-[5px] bg-[#FFAB19] p-[5px] text-white"
          >
            Sửa
          </Link>
          <button
            onClick={() => handleOpen(productCategory._id)}
            className="border rounded-[5px] bg-[#BC3433] p-[5px] text-white"
          >
            Xóa
          </button>
        </TableCell>
      </TableRow>
      {productCategory.children?.map((child) => (
        <ProductTree
          key={child._id}
          productCategory={child}
          level={level + 1}
          selectedIds={selectedIds}
          accounts={accounts}
          handleCheckbox={handleCheckbox}
          handleToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
          productCategories={productCategories}
          dispatchProductCategory={dispatchProductCategory}
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
      ))}
    </>
  )
}

export default ProductTree