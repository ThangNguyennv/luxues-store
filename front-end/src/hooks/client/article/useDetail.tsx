import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleAPI } from '~/apis/client/article.api'
import type { ArticleDetailInterface, ArticleInfoInterface } from '~/types/article.type'

const useDetail = () => {
  const [articleDetail, setArticleDetail] = useState<ArticleInfoInterface | null>(null)
  const params = useParams()
  const slugArticle = params.slugArticle as string

  useEffect(() => {
    if (!slugArticle) return
    fetchDetailArticleAPI(slugArticle)
      .then((response: ArticleDetailInterface) => {
        setArticleDetail(response.article)
      })
  }, [slugArticle])
  return {
    articleDetail
  }
}

export default useDetail