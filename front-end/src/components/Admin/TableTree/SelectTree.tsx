import type { ProductCategoryDetailInterface } from '~/types'


interface Props {
  product: ProductCategoryDetailInterface
  level: number
  products: ProductCategoryDetailInterface[]
  parent_id: string
}

const SelectTree = ({ product, level, products, parent_id }: Props) => {
  const prefix = '- '.repeat(level)
  return (
    <>
      <option value={product._id} selected={product._id === parent_id ? true : false}>
        {prefix}{product.title}
      </option>
      {product.children?.map((child) => (
        <SelectTree
          key={child._id}
          level={level + 1}
          product={child}
          products={products}
          parent_id={parent_id}
        />
      ))}
    </>
  )
}

export default SelectTree