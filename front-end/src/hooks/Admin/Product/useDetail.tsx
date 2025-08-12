import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis/admin/product.api'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types'

export const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductDetailInterface) => {
        setProductDetail(response.product)
      })
  }, [id])
  return {
    productDetail,
    id
  }
}