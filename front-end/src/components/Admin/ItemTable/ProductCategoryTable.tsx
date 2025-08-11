import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/admin/productCategory/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/admin/productCategory/useTable'
import ProductTree from '../TableTree/ProductTree'

const ProductCategoryTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    dispatchProductCategory,
    productCategories,
    accounts,
    handleToggleStatus,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  } = useTable({ selectedIds, setSelectedIds })

  return (
    <>
      <Table sx={{
        borderCollapse: 'collapse',
        '& th, & td': {
          border: '1px solid #ccc' // đường kẻ
        }
      }}>
        <TableHead>
          <TableRow>
            <TableCell align='center'>
              <Checkbox
                checked={isCheckAll}
                onChange={(event) => handleCheckAll(event.target.checked)}
                {...label}
                size="small"
                sx={{ padding: 0 }}
              />
            </TableCell>
            <TableCell align='center'>Tiêu đề</TableCell>
            <TableCell align='center'>Hình ảnh</TableCell>
            <TableCell align='center'>Vị trí</TableCell>
            <TableCell align='center'>Trạng thái</TableCell>
            <TableCell align='center'>Người tạo</TableCell>
            <TableCell align='center'>Cập nhật lần cuối</TableCell>
            <TableCell align='center'>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productCategories.map(productCategory => (
            <ProductTree
              key={productCategory._id}
              productCategory={productCategory}
              level={1}
              selectedIds={selectedIds}
              accounts={accounts}
              handleCheckbox={handleCheckbox}
              handleToggleStatus={handleToggleStatus}
              handleDeleteProduct={handleDeleteProduct}
              productCategories={productCategories}
              dispatchProductCategory={dispatchProductCategory}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ProductCategoryTable