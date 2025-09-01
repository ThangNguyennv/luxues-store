import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailArticleCategoryAPI, fetchEditArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategory'
import type { ArticleCategoryDetailInterface, ArticleCategoryInfoInterface } from '~/types/articleCategory.type'

export const useEdit = () => {
  const [articleCategoryInfo, setArticleCategoryInfo] = useState<ArticleCategoryInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { stateArticleCategory } = useArticleCategoryContext()
  const { allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailArticleCategoryAPI(id)
      .then((response: ArticleCategoryDetailInterface) => {
        setArticleCategoryInfo(response.articleCategory)
      })
  }, [id])

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  // const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!articleCategoryInfo) return

    const formData = new FormData(event.currentTarget)
    formData.set('title', articleCategoryInfo.title)
    formData.set('descriptionShort', articleCategoryInfo.descriptionShort)
    formData.set('descriptionDetail', articleCategoryInfo.descriptionDetail)
    formData.set('position', articleCategoryInfo.position.toString())

    const response = await fetchEditArticleCategoryAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/articles-category/detail/${id}`)
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
    handleClick
  }
}