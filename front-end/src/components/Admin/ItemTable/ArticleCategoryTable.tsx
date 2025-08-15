import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
import ArticleTree from '../TableTree/ArticleTree'
import TableContainer from '@mui/material/TableContainer'
import { useTable, type Props } from '~/hooks/admin/articleCategory/useTable'

const ArticleCategoryTable = ({ selectedIds, setSelectedIds }: Props) => {
  const {
    dispatchArticleCategory,
    articleCategories,
    accounts,
    handleToggleStatus,
    handleDeleteArticleCategory,
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
            {articleCategories && articleCategories.length > 0 && (
              articleCategories.map(articleCategory => (
                <ArticleTree
                  key={articleCategory._id}
                  articleCategory={articleCategory}
                  level={1}
                  selectedIds={selectedIds}
                  accounts={accounts}
                  handleCheckbox={handleCheckbox}
                  handleToggleStatus={handleToggleStatus}
                  handleDeleteArticleCategory={handleDeleteArticleCategory}
                  articleCategories={articleCategories}
                  dispatchArticleCategory={dispatchArticleCategory}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default ArticleCategoryTable