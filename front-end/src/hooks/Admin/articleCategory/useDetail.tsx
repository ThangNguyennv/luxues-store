import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleCategoryAPI } from '~/apis/admin/articleCategory.api'
import type { ArticleCategoryDetailInterface, ArticleCategoryInfoInterface } from '~/types/articleCategory.type'

export const useDetail = () => {
  const [articleCategoryDetail, setArticleCategoryDetail] = useState<ArticleCategoryInfoInterface | null>(null)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (!id) return
    fetchDetailArticleCategoryAPI(id)
      .then((response: ArticleCategoryDetailInterface) => {
        setArticleCategoryDetail(response.articleCategory)
      })
  }, [id])
  return {
    articleCategoryDetail,
    id
  }
}