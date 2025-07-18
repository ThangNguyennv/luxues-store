import { useEffect, useState } from 'react'
import { fetchProductAPI } from '~/apis/index'

export interface ProductInterface {
  _id: string;
  title: string;
  price: number;
}

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductInterface[]>([])
  useEffect(() => {
    fetchProductAPI().then((products: ProductInterface[]) => {
      setProducts(products)
    })
  }, [])
  return (
    <div>
      {products.map(item => (
        <div key={item._id}>
          <h3>{item.title}</h3>
          <p>Giá: ${item.price}</p>
          <p>Giảm giá: ${item.discountPercentage}</p>
          <img src={item.thumbnail}/>
          <p>còn lại: ${item.stock}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductAdmin