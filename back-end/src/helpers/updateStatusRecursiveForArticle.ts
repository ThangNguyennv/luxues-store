import { UpdatedBy } from "~/controllers/admin/product-category.controller"
import ArticleCategory from "~/models/article-category.model"

export const updateStatusRecursiveForArticle = async (status: string, id: string, currentUser: UpdatedBy): Promise<void> => {
  await ArticleCategory.updateOne(
    { _id: id },
    { 
      status: status, 
      $push: {
        updatedBy: {
          account_id: currentUser.account_id,
          updatedAt: currentUser.updatedAt
        }
      }
    }
  )
  const children = await ArticleCategory.find({ parent_id: id })

  for (let child of children) {
    await updateStatusRecursiveForArticle(status, child._id.toString(), currentUser)
  }
}