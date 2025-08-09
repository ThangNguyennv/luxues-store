import type { ProductCategoryInfoInterface } from '~/types'

interface Props {
  productCategory: ProductCategoryInfoInterface
  level: number
  productCategories: ProductCategoryInfoInterface[]
  parent_id: string
}

const SelectTree = ({ productCategory, level, productCategories, parent_id }: Props) => {
  const prefix = '- '.repeat(level)
  return (
    <>
      <option value={productCategory._id} selected={productCategory._id === parent_id ? true : false}>
        {prefix}{productCategory.title}
      </option>
      {productCategory.children?.map((child) => (
        <SelectTree
          key={child._id}
          level={level + 1}
          productCategory={child}
          productCategories={productCategories}
          parent_id={parent_id}
        />
      ))}
    </>
  )
}

export default SelectTree