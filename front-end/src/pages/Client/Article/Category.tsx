import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import useCategory from '~/hooks/client/article/useCategory'

const ArticleCategory = () => {
  const {
    pageTitle,
    articleCategory
  } = useCategory()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[150px]">
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