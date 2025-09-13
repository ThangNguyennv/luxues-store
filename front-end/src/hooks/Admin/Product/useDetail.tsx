import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDetailProductAPI } from '~/apis/admin/product.api'
import { useAuth } from '~/contexts/admin/AuthContext'
import type { ProductDetailInterface, ProductInfoInterface } from '~/types/product.type'

export const useDetail = () => {
  const [productDetail, setProductDetail] = useState<ProductInfoInterface | null>(null)
  const params = useParams()
  const id = params.id
  const { role } = useAuth()

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductDetailInterface) => {
        setProductDetail(response.product)
      })
  }, [id])
  return {
    productDetail,
    id,
    role
  }
}