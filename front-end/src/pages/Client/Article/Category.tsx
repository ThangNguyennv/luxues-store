import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailArticleCategoryAPI } from '~/apis/client/article.api'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import type { ArticleInfoInterface, ArticlesWithCategoryDetailInterface } from '~/types/article.type'

const ArticleCategory = () => {
  const [articleCategory, setArticleCategory] = useState<ArticleInfoInterface[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const params = useParams()
  const slugCategory = params.slugCategory as string

  useEffect(() => {
    fetchDetailArticleCategoryAPI(slugCategory). then((res: ArticlesWithCategoryDetailInterface) => {
      setArticleCategory(res.articles)
      setPageTitle(res.pageTitle)
    })
  }, [slugCategory])

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={pageTitle}/>
          {articleCategory && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {articleCategory.map((article, index) => (
                <Link to={`/articles/detail/${article.slug}`} key={index}>
                  <CardItem {...article}/>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ArticleCategory