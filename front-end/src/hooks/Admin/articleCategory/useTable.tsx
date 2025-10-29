import { fetchChangeStatusWithChildren, fetchDeleteArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategoryContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { updateStatusRecursiveForArticle } from '~/helpers/updateStatusRecursiveForArticle'
import type { UpdatedBy } from '~/types/helper.type'
import { useState } from 'react'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateArticleCategory, dispatchArticleCategory } = useArticleCategoryContext()
  const { articleCategories, accounts, loading } = stateArticleCategory
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const handleOpen = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }
  const handleClose = () => {
    setSelectedId(null)
    setOpen(false)
  }
  const handleToggleStatus = async (currentStatus: string, id: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount ? myAccount._id : '',
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusWithChildren(newStatus, id)
    if (response.code === 200) {
      const updatedAllArticlesCategory = stateArticleCategory.allArticleCategories.map(articleCategory =>
        articleCategory._id === id
          ? { ...articleCategory, status: newStatus, updatedBy: [...(articleCategory.updatedBy || []), currentUser] }
          : articleCategory
      )
      dispatchArticleCategory({
        type: 'SET_DATA',
        payload: {
          articleCategories: updateStatusRecursiveForArticle(articleCategories, id, newStatus, currentUser),
          allArticleCategories: updatedAllArticlesCategory
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

  const handleDelete = async () => {
    if (!selectedId) return
    const response = await fetchDeleteArticleCategoryAPI(selectedId)
    if (response.code === 204) {
      dispatchArticleCategory({
        type: 'SET_DATA',
        payload: {
          articleCategories: articleCategories.filter((articleCategory) => articleCategory._id != selectedId)
        }
      })
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setOpen(false)
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
      const allIds = articleCategories
        .map((articleCategory) => articleCategory._id)
        .filter((id): id is string => id !== undefined)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }
  const isCheckAll = (articleCategories.length > 0) && (selectedIds.length === articleCategories.length)

  return {
    loading,
    dispatchArticleCategory,
    articleCategories,
    accounts,
    handleToggleStatus,
    handleDelete,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose
  }
}

