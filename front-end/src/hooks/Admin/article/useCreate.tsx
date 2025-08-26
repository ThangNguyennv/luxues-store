import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateArticleAPI } from '~/apis/admin/article.api'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategory'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import type { ArticleInfoInterface } from '~/types/article.type'

export const useCreate = () => {
  const initialArticle: ArticleInfoInterface = {
    _id: '',
    title: '',
    position: 0,
    status: 'active',
    descriptionShort: '',
    descriptionDetail: '',
    featured: '1',
    thumbnail: '',
    accountFullName: '',
    createdBy: {
      account_id: '',
      // createdAt: new Date()
    },
    updatedBy: [],
    article_category_id: '',
    slug: '',
    createdAt: null,
    updatedAt: null
  }

  const [articleInfo, setArticleInfo] = useState<ArticleInfoInterface>(initialArticle)
  const { stateArticleCategory } = useArticleCategoryContext()
  const { allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('descriptionShort', articleInfo.descriptionShort)
    formData.append('descriptionDetail', articleInfo.descriptionDetail)
    const file = uploadImageInputRef.current?.files?.[0]
    if (file) {
      formData.set('thumbnail', file)
    }
    const response = await fetchCreateArticleAPI(formData)
    if (response.code === 201) {
      setArticleInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/articles')
      }, 2000)
    }
  }

  return {
    allArticleCategories,
    articleInfo,
    setArticleInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  }
}