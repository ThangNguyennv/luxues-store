import type { ArticleCategoryInfoInterface } from '~/types/articleCategory.type'
import type { UpdatedBy } from '~/types/helper.type'

export const updateStatusRecursiveForArticle = (
  categories: ArticleCategoryInfoInterface[],
  parentId: string,
  newStatus: string,
  currentUser: UpdatedBy
): ArticleCategoryInfoInterface[] => {
  return categories.map(category => {
    if (category._id === parentId) {
      // Cập nhật chính nó
      return {
        ...category,
        status: newStatus,
        updatedBy: [...(category.updatedBy || []), currentUser],
        children: category.children
          ? updateStatusRecursiveForArticle(category.children, parentId, newStatus, currentUser)
          : []
      }
    }

    // Nếu category này là con của parentId hoặc nằm sâu hơn
    return {
      ...category,
      children: category.children
        ? updateStatusRecursiveForArticle(category.children, parentId, newStatus, currentUser)
        : []
    }
  })
}
