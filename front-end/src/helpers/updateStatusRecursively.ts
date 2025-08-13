import type { ProductCategoryInfoInterface, UpdatedBy } from '~/types'

export const updateStatusRecursively = (
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
          ? updateStatusRecursively(category.children, parentId, newStatus, currentUser)
          : []
      }
    }

    // Nếu category này là con của parentId hoặc nằm sâu hơn
    return {
      ...category,
      children: category.children
        ? updateStatusRecursively(category.children, parentId, newStatus, currentUser)
        : []
    }
  })
}
