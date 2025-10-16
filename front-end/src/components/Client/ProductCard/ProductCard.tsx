import { Link } from 'react-router-dom'
import type { ProductInfoInterface } from '~/types/product.type'

interface ProductCardProps {
  product: ProductInfoInterface
}

const ProductCard = ({ product }: ProductCardProps) => {
  const priceNew = Math.floor((product.price * (100 - product.discountPercentage)) / 100)

  return (
    <Link to={`/products/detail/${product.slug}`} className="block group">
      <div className="overflow-hidden rounded-lg">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-[300px] object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-red-600">{priceNew.toLocaleString('vi-VN')}đ</span>
          {product.discountPercentage > 0 && (
            <span className="text-sm line-through text-gray-400">{product.price.toLocaleString('vi-VN')}đ</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard