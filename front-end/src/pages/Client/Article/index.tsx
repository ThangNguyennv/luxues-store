import { Link } from 'react-router-dom'
import BoxHead from '~/components/Client/BoxHead/BoxHead'
import Pagination from '~/components/Admin/Pagination/Pagination'
import useIndex from '~/hooks/client/article/useIndex'
import ArticleCard from '~/components/Client/ArticleCard/ArticleCard'

const ArticleClient = () => {
  const {
    articles,
    pagination,
    updateSearchParams
  } = useIndex()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={'Tất cả bài viết'}/>
          {articles && (
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[15px]'>
              {articles.map((article, index) => (
                <Link to={`/articles/detail/${article.slug}`} key={index}>
                  <ArticleCard item={article}/>
                </Link>
              ))}
            </div>
          )}
          <Pagination
            pagination={pagination}
            handlePagination={(page: number) => updateSearchParams('page', (page).toString())}
            handlePaginationPrevious={(page: number) => updateSearchParams('page', (page - 1).toString())}
            handlePaginationNext={(page: number) => updateSearchParams('page', (page + 1).toString())}
            items={articles}
          />
        </div>
      </div>
    </>
  )
}

export default ArticleClient