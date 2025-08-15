import ProductCategory from "~/models/product-category.model"
import { UpdatedBy } from "~/controllers/admin/product-category.controller"

export const updateStatusRecursiveForProduct = async (status: string, id: string, currentUser: UpdatedBy): Promise<void> => {
  await ProductCategory.updateOne(
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
  const children = await ProductCategory.find({ parent_id: id })

  for (let child of children) {
    await updateStatusRecursiveForProduct(status, child._id.toString(), currentUser)
  }
}