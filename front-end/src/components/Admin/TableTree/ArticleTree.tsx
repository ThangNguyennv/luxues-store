/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TableRow, TableCell, Checkbox } from '@mui/material'
import { Link } from 'react-router-dom'
import FormatDateTime from '../Moment/FormatDateTime'
import type { ArticleCategoryActions, ArticleCategoryInfoInterface } from '~/types/articleCategory.type'
import type { AccountInfoInterface } from '~/types/account.type'

interface Props {
  articleCategory: ArticleCategoryInfoInterface
  level: number
  selectedIds: string[]
  accounts: AccountInfoInterface[]
  handleCheckbox: (id: string, checked: boolean) => void
  handleToggleStatus: (id: string, status: string) => void
  handleDeleteArticleCategory: (id: string) => void
  dispatchArticleCategory: React.Dispatch<ArticleCategoryActions>
  articleCategories: ArticleCategoryInfoInterface[]
}

const ArticleTree = ({
  articleCategory,
  level,
  selectedIds,
  accounts,
  handleCheckbox,
  handleToggleStatus,
  handleDeleteArticleCategory,
  dispatchArticleCategory,
  articleCategories
}: Props) => {
  const prefix = '— '.repeat(level)

  const updatedBy = articleCategory.updatedBy?.at(-1)
  const creator = accounts.find((account) => account._id === articleCategory.createdBy?.account_id)
  const updater = accounts.find((account) => account._id === updatedBy?.account_id)

  return (
    <>
      <TableRow key={articleCategory._id}>
        <TableCell align="center">
          <Checkbox
            checked={selectedIds.includes(articleCategory._id)}
            onChange={(e) => handleCheckbox(articleCategory._id, e.target.checked)}
            size="small"
            sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell align="left">{prefix}{articleCategory.title}</TableCell>
        <TableCell align="center">
          <div className="flex justify-center items-center">
            <img src={articleCategory.thumbnail} alt={articleCategory.title} className="w-[100px] h-[100px]" />
          </div>
        </TableCell>
        <TableCell align="center">
          <input
            type="number"
            value={articleCategory.position}
            min="1"
            onChange={(e) => {
              const newPosition = parseInt(e.target.value, 10)
              dispatchArticleCategory({
                type: 'SET_DATA',
                payload: {
                  articleCategories: articleCategories.map((p) =>
                    p._id === articleCategory._id ? { ...p, position: newPosition } : p
                  )
                }
              })
            }}
            className="border rounded-[5px] border-[#00171F] w-[50px] p-[2px]"
          />
        </TableCell>
        <TableCell align="center">
          <button
            onClick={() => handleToggleStatus(articleCategory.status, articleCategory._id)}
            className={`cursor-pointer border rounded-[5px] p-[5px] text-white ${articleCategory.status === 'active' ? 'bg-[#607D00]' : 'bg-[#BC3433]'}`}
          >
            {articleCategory.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
          </button>
        </TableCell>
        <TableCell align="center">
          {creator ? (
            <>
              <p className="text-sm font-medium text-gray-800">{creator.fullName}</p>
              <FormatDateTime time={articleCategory.createdBy?.createdAt} />
            </>
          ) : (
            <p className="text-sm italic text-gray-400">Không xác định</p>
          )}
        </TableCell>
        <TableCell align="center">
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
        <TableCell align="center">
          <Link to={`/admin/articles-category/detail/${articleCategory._id}`} className="border rounded-[5px] bg-[#757575] p-[5px] text-white">Chi tiết</Link>
          <Link to={`/admin/articles-category/edit/${articleCategory._id}`} className="border rounded-[5px] bg-[#FFAB19] p-[5px] text-white">Sửa</Link>
          <button onClick={() => handleDeleteArticleCategory(articleCategory._id)} className="cursor-pointer border rounded-[5px] bg-[#BC3433] p-[5px] text-white">Xóa</button>
        </TableCell>
      </TableRow>
      {articleCategory.children?.map((child) => (
        <ArticleTree
          key={child._id}
          articleCategory={child}
          level={level + 1}
          selectedIds={selectedIds}
          accounts={accounts}
          handleCheckbox={handleCheckbox}
          handleToggleStatus={handleToggleStatus}
          handleDeleteArticleCategory={handleDeleteArticleCategory}
          articleCategories={articleCategories}
          dispatchArticleCategory={dispatchArticleCategory}
        />
      ))}
    </>
  )
}

export default ArticleTree