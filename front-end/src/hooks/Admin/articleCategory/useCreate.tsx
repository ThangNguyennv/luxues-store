import { useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCreateArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategory'
import type { ArticleCategoryInfoInterface } from '~/types/articleCategory.type'
import { useAuth } from '~/contexts/admin/AuthContext'

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
      account_id: ''
      // createdAt: new Date()
    },
    updatedBy: [],
    children: [],
    slug: '',
    parent_id: '',
    createdAt: null,
    updatedAt: null
  }

  const [articleCategoryInfo, setArticleCategoryInfo] = useState<ArticleCategoryInfoInterface>(initialArticleCategory)
  const { stateArticleCategory } = useArticleCategoryContext()
  const { dispatchAlert } = useAlertContext()
  const { allArticleCategories } = stateArticleCategory
  const { role } = useAuth()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | null>(null)
  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  // const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('descriptionShort', articleCategoryInfo.descriptionShort)
    formData.append('descriptionDetail', articleCategoryInfo.descriptionDetail)
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }
  return {
    allArticleCategories,
    articleCategoryInfo,
    setArticleCategoryInfo,
    uploadImageInputRef,
    preview,
    handleChange,
    handleSubmit,
    handleClick,
    role
  }
}