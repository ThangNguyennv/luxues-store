/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI } from '~/apis/client/product.api'
import BoxHead from '~/components/Client/BoxHead/BoxHead'
import CardItem from '~/components/Client/CardItem/CardItem'
import type { ProductInfoInterface, ProductsWithCategoryDetailInterface } from '~/types/product.type'
import Skeleton from '@mui/material/Skeleton'

const ProductCategory = () => {
  const [productCategory, setProductCategory] = useState<ProductInfoInterface[]>([])
  const [pageTitle, setPageTitle] = useState('')
  const params = useParams()
  const slugCategory = params.slugCategory as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res: ProductsWithCategoryDetailInterface = await fetchDetailProductCategoryAPI(slugCategory)
        setProductCategory(res.products)
        setPageTitle(res.pageTitle)
      } catch (error) {
        console.error('Lỗi khi fetch danh mục sản phẩm:', error)
        setPageTitle('Không tìm thấy danh mục')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slugCategory])

  const CardItemSkeleton = () => (
    <div className="flex flex-col items-center gap-[15px] rounded-[5px] border border-gray-200 bg-white p-[10px] text-center h-full">
      <Skeleton variant="rectangular" width="100%" height={250} />
      <div className="flex flex-col items-center gap-2 px-2 pb-2 w-full">
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={28} />
      </div>
    </div>
  )
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[150px] px-4">
          <Skeleton variant="text" width={300} height={60} sx={{ fontSize: '2.25rem', marginBottom: '2rem' }} />
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {
              Array.from({ length: 8 }).map((_, index) => (
                <CardItemSkeleton key={index} />
              ))
            }
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[150px] px-4">
          <BoxHead title={pageTitle}/>
          {productCategory && productCategory.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {productCategory.map((product) => (
                <Link to={`/products/detail/${product.slug}`} key={product._id || product.slug} className="h-full">
                  <CardItem item={product}/>
                </Link>
              ))}
            </div>
          ): (
            <p className="text-center text-gray-500">Không có sản phẩm nào thuộc danh mục &quot;{pageTitle}&quot;.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductCategory