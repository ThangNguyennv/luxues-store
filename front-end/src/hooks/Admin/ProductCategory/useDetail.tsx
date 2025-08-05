import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis/admin/product.api'
import type { ProductDetailInterface, ProductInterface } from '~/components/Admin/Types/Interface'

export const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductDetailInterface | null>(null)
  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductInterface) => {
        setProductDetail(response.product)
      })
  }, [id])
  return {
    productDetail,
    setProductDetail,
    id
  }
}