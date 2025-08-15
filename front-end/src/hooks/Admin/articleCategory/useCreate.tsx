import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategory'
import type { ArticleCategoryInfoInterface } from '~/types/articleCategory.type'

export const useCreate = () => {
  const initialArticleCategory: ArticleCategoryInfoInterface = {
    _id: '',
    title: '',
    position: 0,
    status: 'active',
    descriptionShort: '',
    descriptionDetail: '',
    thumbnail: '',
    createdBy: {
      account_id: '',
      createdAt: new Date()
    },
    updatedBy: [],
    children: [],
    slug: '',
    parent_id: ''
  }

  const [articleCategoryInfo, setArticleCategoryInfo] = useState<ArticleCategoryInfoInterface>(initialArticleCategory)
  const { stateArticleCategory } = useArticleCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allArticleCategories } = stateArticleCategory

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
    const file = uploadImageInputRef.current?.files?.[0]
    if (file) {
      formData.set('thumbnail', file) // hoặc append nếu bạn chưa có key
    }
    const response = await fetchCreateArticleCategoryAPI(formData)
    if (response.code === 201) {
      setArticleCategoryInfo(response.data)
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate('/admin/articles-category')
      }, 2000)
    }
  }
  return {
    allArticleCategories,
    articleCategoryInfo,
    setArticleCategoryInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  }
}