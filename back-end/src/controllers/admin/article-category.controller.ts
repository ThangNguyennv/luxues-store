import { Request, Response } from 'express'
import ArticleCategory from '~/models/article-category.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import { buildTree, TreeItem } from '~/helpers/createTree'
import { addLogInfoToTree, LogNode } from '~/helpers/addLogInfoToChildren'
import paginationHelpers from '~/helpers/pagination'
import { buildTreeForPagedItems } from '~/helpers/createChildForParent'
import Account from '~/models/account.model'

// [GET] /admin/articles-category
export const index = async (req: Request, res: Response) => {
  try {
    interface Find {
      deleted: boolean,
      status?: string,
      title?: RegExp,
      parent_id?: string
    }
    const find: Find = {
      deleted: false
    }
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
    const countParents = await ArticleCategory.countDocuments(parentFind)
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
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toLocaleString()
      sort[sortKey] = req.query.sortValue
    } else {
      sort['position'] = 'desc'
    }
    // // End Sort

    const articleCategories = await ArticleCategory
      .find(find)
      .sort(sort)

    const parentCategories = await ArticleCategory
      .find(parentFind)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)

    // Tạo cây phân cấp
    const newArticleCategories = buildTreeForPagedItems(parentCategories as unknown as TreeItem[], articleCategories as unknown as TreeItem[])

    const newAllArticleCategories = buildTree(articleCategories as unknown as TreeItem[])

    // Thêm thông tin log
    await addLogInfoToTree(newArticleCategories as LogNode[])
    await addLogInfoToTree(newAllArticleCategories as LogNode[])

    const accounts = await Account.find({
      deleted: false
    })

    res.json({
      code: 200,
      message: 'Thành công!',
      accounts: accounts,
      articleCategories: articleCategories,
      filterStatus: filterStatusHelpers(req.query),
      allArticleCategories: newAllArticleCategories,
      keyword: objectSearch.keyword
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles-category/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status
    const id: string = req.params.id
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await ArticleCategory.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: updatedBy } }
    )

    res.json({
      code: 200,
      message: 'Cập nhật thành công trạng thái danh mục bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles-category/change-multi
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
      CHANGEPOSITION = 'change-position',
    }
    switch (type) {
      case Key.ACTIVE:
        await ArticleCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.INACTIVE:
        await ArticleCategory.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.DELETEALL:
        await ArticleCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} danh mục bài viết!`
        })
        break
      case Key.CHANGEPOSITION:
        for (const item of ids) {
          const [id, position] = item.split('-')
          await ArticleCategory.updateOne(
            { _id: { $in: id } },
            { position: Number(position), $push: { updatedBy: updatedBy } }
          )
        }
        res.json({
          code: 200,
          message: `Đổi vị trí thành công ${ids.length} danh mục bài viết!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại danh mục bài viết!'
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

// [DELETE] /admin/articles-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id

    await ArticleCategory.updateOne(
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
      message: 'Xóa thành công danh mục bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/articles-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    if (req.body.position == '') {
      const count = await ArticleCategory.countDocuments()
      req.body.position = count + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    }

    const records = new ArticleCategory(req.body)
    await records.save()

    res.json({
      code: 201,
      message: 'Thêm thành công danh mục bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    req.body.position = parseInt(req.body.position)
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await ArticleCategory.updateOne(
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
      message: 'Cập nhật thành công danh mục bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/articles-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const record = await ArticleCategory.findOne(find)
    res.json({
      code: 200,
      message: 'Thành công!',
      record: record
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
