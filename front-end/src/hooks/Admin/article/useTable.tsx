import { fetchChangeStatusAPI, fetchDeleteArticleAPI } from '~/apis/admin/article.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useSearchParams } from 'react-router-dom'
import type { UpdatedBy } from '~/types/helper.type'
import { useArticleContext } from '~/contexts/admin/ArticleContext'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateArticle, dispatchArticle } = useArticleContext()
  const { articles, accounts } = stateArticle
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount ? myAccount._id : '',
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      dispatchArticle({
        type: 'SET_DATA',
        payload: {
          articles:  articles.map((article) => article._id === id ? {
            ...article,
            status: newStatus,
            updatedBy: [...(article.updatedBy || []), currentUser]
          }: article)
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

  const handleDeleteArticle = async (id: string) => {
    const isConfirm = confirm('Bạn có chắc muốn xóa bài viết này?')
    const response = await fetchDeleteArticleAPI(id)
    if (response.code === 204) {
      if (isConfirm) {
        dispatchArticle({
          type: 'SET_DATA',
          payload: {
            articles: articles.filter((article) => article._id != id)
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
      const allIds = articles.map((article) => article._id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const isCheckAll = (articles.length > 0) && (selectedIds.length === articles.length)

  return {
    currentStatus,
    articles,
    dispatchArticle,
    accounts,
    handleToggleStatus,
    handleDeleteArticle,
    handleCheckbox,
    handleCheckAll,
    isCheckAll
  }
}