import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductCategoryAPI } from '~/apis/admin/productCategory.api'
import type { ProductCategoryDetailInterface, ProductCategoryInfoInterface } from '~/types'

export const useDetail = () => {
  const [productCategoryDetail, setProductCategoryDetail] = useState<ProductCategoryInfoInterface | null>(null)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (!id) return
    fetchDetailProductCategoryAPI(id)
      .then((response: ProductCategoryDetailInterface) => {
        setProductCategoryDetail(response.productCategory)
      })
  }, [id])
  return {
    productCategoryDetail,
    id
  }
}