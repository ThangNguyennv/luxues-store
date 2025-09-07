import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import Pagination from '~/components/admin/Pagination/Pagination'
import { useProductContext } from '~/contexts/client/ProductContext'

const ProductClient = () => {
  const { stateProduct, fetchProduct } = useProductContext()
  const { products, pagination, keyword } = stateProduct
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentKeyword = searchParams.get('keyword') || ''
  const currentSortKey = searchParams.get('sortKey') || ''
  const currentSortValue = searchParams.get('sortValue') || ''

  useEffect(() => {
    fetchProduct({
      page: currentPage,
      keyword: currentKeyword,
      sortKey: currentSortKey,
      sortValue: currentSortValue
    })
  }, [currentPage, currentKeyword, currentSortKey, currentSortValue, fetchProduct])

  const updateSearchParams = (key: string, value: string): void => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }

    // Nếu xóa sortKey hoặc sortValue → xóa cả 2
    if ((key === 'sortKey' || key === 'sortValue') && !value) {
      newParams.delete('sortKey')
      newParams.delete('sortValue')
    }

    setSearchParams(newParams)
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={'Tất cả sản phẩm'}/>
          {products && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {products.map((product, index) => (
                <Link to={''} key={index}>
                  <CardItem {...product}/>
                </Link>
              ))}
            </div>
          )}
          <Pagination
            pagination={pagination}
            handlePagination={(page) => updateSearchParams('page', (page).toString())}
            handlePaginationPrevious={(page) => updateSearchParams('page', (page - 1).toString())}
            handlePaginationNext={(page) => updateSearchParams('page', (page + 1).toString())}
            items={products}
          />
        </div>
      </div>
    </>
  )
}

export default ProductClient