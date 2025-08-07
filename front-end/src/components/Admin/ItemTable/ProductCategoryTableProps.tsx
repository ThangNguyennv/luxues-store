import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { AlertToast } from '~/components/Alert/Alert'
import Checkbox from '@mui/material/Checkbox'
import { useTable } from '~/hooks/Admin/ProductCategory/useTable'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import type { Props } from '~/hooks/Admin/ProductCategory/useTable'
import ProductRow from '../TableTree/TableTree'

const ProductCategoryTableProps = ({ listProducts, listAccounts, selectedIds, setSelectedIds }: Props) => {
  const {
    products,
    setProducts,
    accounts,
    alertOpen,
    setAlertOpen,
    alertMessage,
    alertSeverity,
    handleToggleStatus,
    handleDeleteProduct,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  } = useTable({ listProducts, listAccounts, selectedIds, setSelectedIds })

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
            <TableCell align='center'>
              <Checkbox
                checked={isCheckAll}
                onChange={(event) => handleCheckAll(event.target.checked)}
                {...label}
                size="small"
                sx={{ padding: 0 }}
              />
            </TableCell>
            <TableCell align='center'>STT</TableCell>
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
          {products.map(product => (
            <ProductRow
              key={product._id}
              product={product}
              level={1}
              selectedIds={selectedIds}
              accounts={accounts}
              handleCheckbox={handleCheckbox}
              handleToggleStatus={handleToggleStatus}
              handleDeleteProduct={handleDeleteProduct}
              setProducts={setProducts}
              products={products}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ProductCategoryTableProps