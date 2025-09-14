import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI } from '~/apis/client/product.api'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import type { ProductInfoInterface, ProductsWithCategoryDetailInterface } from '~/types/product.type'

const ProductCategory = () => {
  const [productCategory, setProductCategory] = useState<ProductInfoInterface[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const params = useParams()
  const slugCategory = params.slugCategory as string

  useEffect(() => {
    fetchDetailProductCategoryAPI(slugCategory). then((res: ProductsWithCategoryDetailInterface) => {
      setProductCategory(res.products)
      setPageTitle(res.pageTitle)
    })
  }, [slugCategory])

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[150px]">
          <BoxHead title={pageTitle}/>
          {productCategory && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {productCategory.map((product, index) => (
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

export default ProductCategory