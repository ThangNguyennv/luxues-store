import type { UpdatedBy } from '~/types/helper.type'
import type { ProductCategoryInfoInterface } from '~/types/productCategory.type'

export const updateStatusRecursiveForProduct = (
  categories: ProductCategoryInfoInterface[],
  parentId: string,
  newStatus: string,
  currentUser: UpdatedBy
): ProductCategoryInfoInterface[] => {
  return categories.map(category => {
    if (category._id === parentId) {
      // Cập nhật chính nó
      return {
        ...category,
        status: newStatus,
        updatedBy: [...(category.updatedBy || []), currentUser],
        children: category.children
          ? updateStatusRecursiveForProduct(category.children, parentId, newStatus, currentUser)
          : []
      }
    }

    // Nếu category này là con của parentId hoặc nằm sâu hơn
    return {
      ...category,
      children: category.children
        ? updateStatusRecursiveForProduct(category.children, parentId, newStatus, currentUser)
        : []
    }
  })
}
