import { Request, Response } from 'express'
import ProductCategory from '~/models/product-category.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import { buildTree, TreeItem } from '~/helpers/createTree'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import { addLogInfoToTree, LogNode } from '~/helpers/addLogInfoToChildren'
import Account from '~/models/account.model'
import paginationHelpers from '~/helpers/pagination'
import { updateStatusRecursiveForProduct } from '~/helpers/updateStatusRecursiveForProduct'

// [GET] /admin/products-category
export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean,
      status?: string,
      title?: RegExp,
      parent_id?: string
    }

    const find: Find = { deleted: false }

    if (req.query.status) {
      find.status = req.query.status.toString()
    }

    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.regex) {
      find.title = objectSearch.regex
    }
    // End search

    // Pagination
    const parentFind: Find = { ...find, parent_id: '' }
    const countParents = await ProductCategory.countDocuments(parentFind)
    const objectPagination = paginationHelpers(
      { 
        currentPage: 1, 
        limitItems: 2 
      },
      req.query,
      countParents
    )
    // End Pagination

    // Sort
    const sort: Record<string, any> = {}
    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toLocaleString()
      sort[sortKey] = req.query.sortValue
    } else {
      sort['position'] = 'desc'
    }
    // // End Sort
    const allCategories = await ProductCategory.find({ deleted: false }).sort(sort)
  
    // 👉 Query song song bằng Promise.all (giảm round-trip)
    const [parentCategories, accounts] = await Promise.all([
      ProductCategory.find(parentFind)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip), // chỉ parent
      Account.find({ deleted: false }) // account info
    ])
    
    // Add children vào cha (Đã phân trang giới hạn 2 item)
    const newProductCategories = buildTreeForPagedItems(parentCategories as unknown as TreeItem[], allCategories as unknown as TreeItem[])
  
    // Add children vào cha (Không có phân trang, lấy tất cả item)
    const newAllProductCategories = buildTree(allCategories as unknown as TreeItem[])

    // Gắn account info cho tree
    const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
    addLogInfoToTree(newProductCategories as LogNode[], accountMap)
    addLogInfoToTree(newAllProductCategories as LogNode[], accountMap)

    res.json({
      code: 200,
      message: 'Thành công!',
      productCategories: newProductCategories,
      allProductCategories: newAllProductCategories,
      accounts: accounts,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// // [PATCH] /admin/products-category/change-status/:status/:id
// export const changeStatus = async (req: Request, res: Response) => {
//   try {
//     const status = req.params.status
//     const id = req.params.id
//     const updatedBy = {
//       account_id: req['accountAdmin'].id,
//       updatedAt: new Date()
//     }
//     await ProductCategory.updateOne(
//       { _id: id },
//       { status: status, $push: { updatedBy: updatedBy } }
//     )
//     res.json({
//       code: 200,
//       message: 'Cập nhật trạng thái danh mục sản phẩm thành công !'
//     })
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: 'Lỗi!',
//       error: error
//     })
//   }
// }

export interface UpdatedBy {
  account_id: string,
  updatedAt: Date
}

export const changeStatusWithChildren = async (req: Request, res: Response) => {
   try {
    const { status, id } = req.params;
    const updatedBy: UpdatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }

    await updateStatusRecursiveForProduct(status, id, updatedBy);

    return res.json({ 
      code: 200, 
      message: "Cập nhật thành công trạng thái danh mục sản phẩm!" 
    });
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/products-category/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    enum Key {
      ACTIVE = 'active',
      INACTIVE = 'inactive',
      DELETEALL = 'delete-all',
    }
    switch (type) {
      case Key.ACTIVE:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục sản phẩm!`
        })
        break
      case Key.INACTIVE:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục sản phẩm!`
        })
        break
      case Key.DELETEALL:
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} danh mục sản phẩm!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại danh mục sản phẩm!'
        })
        break
    }
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [DELETE] /admin/products-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    await ProductCategory.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: req['accountAdmin'].id,
          deletedAt: new Date()
        }
      }
    )
    res.json({
      code: 204,
      message: 'Xóa thành công danh mục sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/products-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    if (req.body.position == '') {
      const count = await ProductCategory.countDocuments()
      req.body.position = count + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    }
    const records = new ProductCategory(req.body)
    await records.save()
    res.json({
      code: 201,
      message: 'Thêm thành công danh mục sản phẩm!',
      data: records
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/products-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    req.body.position = parseInt(req.body.position)
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await ProductCategory.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy
        }
      }
    )
    res.json({
      code: 200,
      message: 'Cập nhật thành công danh mục sản phẩm!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/products-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const productCategory = await ProductCategory.findOne(find)
    res.json({
      code: 200,
      message: 'Lấy Thành công chi tiết danh mục sản phẩm!',
      productCategory: productCategory
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
