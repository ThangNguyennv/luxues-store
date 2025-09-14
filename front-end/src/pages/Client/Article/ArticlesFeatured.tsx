import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import { useHome } from '~/contexts/client/HomeContext'

const ArticlesFeatured = () => {
  const { dataHome } = useHome()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={'Bài viết nổi bật'}/>
          {dataHome && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {dataHome.articlesFeatured.map((article, index) => (
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

export default ArticlesFeatured