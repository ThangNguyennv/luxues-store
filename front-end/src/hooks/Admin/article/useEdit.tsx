import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailArticleAPI, fetchEditArticleAPI } from '~/apis/admin/article.api'
import { useAlertContext } from '~/contexts/alert/AlertContext'
import { useArticleCategoryContext } from '~/contexts/admin/ArticleCategory'
import type { ArticleDetailInterface, ArticleInfoInterface } from '~/types/article.type'

export const useEdit = () => {
  const [articleInfo, setArticleInfo] = useState<ArticleInfoInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const { stateArticleCategory } = useArticleCategoryContext()
  const { allArticleCategories } = stateArticleCategory
  const { dispatchAlert } = useAlertContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailArticleAPI(id)
      .then((response: ArticleDetailInterface) => {
        setArticleInfo(response.article)
      })
  }, [id])

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  // const [preview, setPreview] = useState<string | null>(null)


  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!articleInfo) return
    const formData = new FormData(event.currentTarget)
    formData.set('title', articleInfo.title)
    formData.set('featured', articleInfo.featured)
    formData.set('descriptionShort', articleInfo.descriptionShort)
    formData.set('descriptionDetail', articleInfo.descriptionDetail)
    formData.set('position', articleInfo.position.toString())

    const response = await fetchEditArticleAPI(id, formData)
    if (response.code === 200) {
      dispatchAlert({
        type: 'SHOW_ALERT',
        payload: { message: response.message, severity: 'success' }
      })
      setTimeout(() => {
        navigate(`/admin/articles/detail/${id}`)
      }, 2000)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    uploadImageInputRef.current?.click()
  }

  return {
    allArticleCategories,
    articleInfo,
    setArticleInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit,
    handleClick
  }
}