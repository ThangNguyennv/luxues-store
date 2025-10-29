import { fetchChangeStatusAPI, fetchDeleteArticleAPI } from '~/apis/admin/article.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useAuth } from '~/contexts/admin/AuthContext'
import { useSearchParams } from 'react-router-dom'
import type { UpdatedBy } from '~/types/helper.type'
import { useArticleContext } from '~/contexts/admin/ArticleContext'
import { useState } from 'react'

export interface Props {
  selectedIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const useTable = ({ selectedIds, setSelectedIds }: Props) => {
  const { stateArticle, dispatchArticle } = useArticleContext()
  const { articles, accounts, loading } = stateArticle
  const { myAccount } = useAuth()
  const { dispatchAlert } = useAlertContext()
  const [searchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || ''
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

  const handleToggleStatus = async (id: string, currentStatus: string): Promise<void> => {
    const currentUser: UpdatedBy = {
      account_id: myAccount ? myAccount._id : '',
      updatedAt: new Date()
    }
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const response = await fetchChangeStatusAPI(newStatus, id)
    if (response.code === 200) {
      const updatedAllArticles = stateArticle.allArticles.map(article =>
        article._id === id
          ? { ...article, status: newStatus, updatedBy: [...(article.updatedBy || []), currentUser] }
          : article
      )
      const updatedArticles = stateArticle.articles.map(article =>
        article._id === id
          ? { ...article, status: newStatus, updatedBy: [...(article.updatedBy || []), currentUser] }
          : article
      )
      dispatchArticle({
        type: 'SET_DATA',
        payload: {
          articles: updatedArticles,
          allArticles: updatedAllArticles
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

    const response = await fetchDeleteArticleAPI(selectedId)
    if (response.code === 204) {
      dispatchArticle({
        type: 'SET_DATA',
        payload: {
          articles: articles.filter((article) => article._id !== selectedId)
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
      const allIds = articles
        .map((article) => article._id)
        .filter((id): id is string => id !== undefined)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const isCheckAll = (articles.length > 0) && (selectedIds.length === articles.length)

  return {
    loading,
    currentStatus,
    articles,
    dispatchArticle,
    accounts,
    handleToggleStatus,
    handleCheckbox,
    handleCheckAll,
    isCheckAll,
    open,
    handleOpen,
    handleClose,
    handleDelete
  }
}