import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'

const Permission = () => {
  return (
    <>
      <h1 className='text-[40px] font-[600] text-[#192335]'>Phân quyền</h1>

      <div className="flex items-center justify-end">
        <button className="border rounded-[5px] bg-[#525FE1] text-white p-[7px]">Cập nhật</button>
      </div>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{
          borderCollapse: 'collapse',
          '& th, & td': {
            border: '1px solid #000000' // đường kẻ
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Tính năng</TableCell>
              <TableCell></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Permission