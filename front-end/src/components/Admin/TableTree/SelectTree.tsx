import type { ProductCategoryInfoInterface } from '~/types'

interface Props {
  productCategory: ProductCategoryInfoInterface
  level: number
  allProductCategories: ProductCategoryInfoInterface[]
  parent_id: string
}

const SelectTree = ({ productCategory, level, allProductCategories, parent_id }: Props) => {
  const prefix = '- '.repeat(level)
  return (
    <>
      <option value={productCategory._id}>
        {prefix}{productCategory.title}
      </option>
      {productCategory.children?.map((child) => (
        <SelectTree
          key={child._id}
          productCategory={child}
          level={level + 1}
          allProductCategories={allProductCategories}
          parent_id={parent_id}
        />
      ))}
    </>
  )
}

export default SelectTree