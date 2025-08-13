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
import TableContainer from '@mui/material/TableContainer'

const ProductCategoryTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    dispatchProductCategory,
    productCategories,
    accounts,
    handleToggleStatus,
    handleDeleteProductCategory,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  } = useTable({ selectedIds, setSelectedIds })

  return (
    <>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #000000' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) => handleCheckAll(event.target.checked)}
                  {...label}
                  size="small"
                  sx={{ padding: 0 }}
                />
              </TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Tiêu đề</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Hình ảnh</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Vị trí</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Trạng thái</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Người tạo</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Cập nhật lần cuối</TableCell>
              <TableCell align='center' sx={{ backgroundColor: '#00A7E6' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productCategories && productCategories.length > 0 && (
              productCategories.map(productCategory => (
                <ProductTree
                  key={productCategory._id}
                  productCategory={productCategory}
                  level={1}
                  selectedIds={selectedIds}
                  accounts={accounts}
                  handleCheckbox={handleCheckbox}
                  handleToggleStatus={handleToggleStatus}
                  handleDeleteProductCategory={handleDeleteProductCategory}
                  productCategories={productCategories}
                  dispatchProductCategory={dispatchProductCategory}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ProductCategoryTable