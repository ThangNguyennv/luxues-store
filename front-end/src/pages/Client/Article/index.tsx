import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import Pagination from '~/components/admin/Pagination/Pagination'
import useIndex from '~/hooks/client/article/useIndex'
import ArticleCard from '~/components/client/ArticleCard/ArticleCard'

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
            <div className='grid grid-cols-4 gap-[15px]'>
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