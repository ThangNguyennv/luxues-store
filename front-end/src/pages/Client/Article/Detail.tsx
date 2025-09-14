import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailArticleAPI } from '~/apis/client/article.api'
import type { ArticleDetailInterface, ArticleInfoInterface } from '~/types/article.type'

const DetailArticle = () => {
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

  return (
    <>
      {articleDetail && (
        <>
          <div className="flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md">
            <div className="container flex border rounded-[5px]">
              <div className='w-[50%] flex items-center justify-center'>
                <img
                  src={articleDetail.thumbnail}
                  alt={articleDetail.title}
                  className='w-[440px] h-[530px] object-cover'
                />
              </div>
              <div className='flex flex-col justify-center gap-[30px] w-[50%]'>
                <div className='font-[600] text-[32px]'>{articleDetail.title}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DetailArticle