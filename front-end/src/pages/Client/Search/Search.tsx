import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSearchAPI } from '~/apis/client/search.api'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import { useProductContext } from '~/contexts/client/ProductContext'
import type { ProductInfoInterface } from '~/types/product.type'
import type { SearchInterface } from '~/types/search.type'

const Search = () => {
  const [products, setProducts] = useState<ProductInfoInterface[]>([])
  const { stateProduct } = useProductContext()
  const { keyword } = stateProduct

  useEffect(() => {
    if (!keyword) return
    fetchSearchAPI(keyword).then((res: SearchInterface) => {
      setProducts(res.products)
    })
  }, [keyword])

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col gap-[10px] mb-[150px]">
          <BoxHead title="Kết quả tìm kiếm"/>
          {products && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {products.map((product, index) => (
                <Link to={`/products/detail/${product.slug}`} key={index}>
                  <CardItem {...product}/>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Search