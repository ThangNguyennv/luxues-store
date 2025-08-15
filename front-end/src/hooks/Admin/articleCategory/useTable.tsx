import { fetchChangeStatusWithChildren, fetchDeleteArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { updateStatusRecursiveForArticle } from '~/helpers/updateStatusRecursiveForArticle'
import type { UpdatedBy } from '~/types/helper.type'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateArticleCategory, dispatchArticleCategory } = useArticleCategoryContext()
  const { articleCategories, accounts } = stateArticleCategory
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()

  const handleToggleStatus = async (currentStatus: string, _id: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount!._id,
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusWithChildren(newStatus, _id)
    if (response.code === 200) {
      dispatchArticleCategory({
        type: 'SET_DATA',
        payload: {
          articleCategories: updateStatusRecursiveForArticle(articleCategories, _id, newStatus, currentUser)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  const handleDeleteArticleCategory = async (_id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa danh mục bài viết này?')
    const response = await fetchDeleteArticleCategoryAPI(_id)
    if (response.code === 204) {
      if (isConfirm) {
        dispatchArticleCategory({
          type: 'SET_DATA',
          payload: {
            articleCategories: articleCategories.filter((articleCategory) => articleCategory._id != _id)
          }
        })
        dispatchAlert({
          type: 'SHOW_ALERT',
          payload: { message: response.message, severity: 'success' }
        })
      }
    } else if (response.code === 400) {
      alert('error: ' + response.error)
      return
    }
  }
  const handleCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      const allIds = articleCategories.map((articleCategory) => articleCategory._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  const isCheckAll = (articleCategories.length > 0) && (selectedIds.length === articleCategories.length)

  return {
    dispatchArticleCategory,
    articleCategories,
    accounts,
    handleToggleStatus,
    handleDeleteArticleCategory,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}

