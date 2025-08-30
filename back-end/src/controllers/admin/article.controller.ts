import { Request, Response } from 'express'
import Article from '~/models/article.model'
import Account from '~/models/account.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'

// [GET] /admin/articles
export const index = async (req: Request, res: Response) => {
  // Bộ lọc
  try {
    interface Find {
      deleted: boolean;
      status?: string;
      title?: RegExp;
    }
    const find: Find = {
      deleted: false
    }

    if (req.query.status) {
      find.status = req.query.status.toString()
    }

    const objectSearch = searchHelpers(req.query)
    if (objectSearch.regex) {
      find.title = objectSearch.regex
    }

    // Pagination
    const countArticles = await Article.countDocuments(find)

    const objectPagination = paginationHelpers(
      {
        currentPage: 1,
        limitItems: 3
      },
      req.query,
      countArticles
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
    // End Sort

    const articles = await Article
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)

    for (const article of articles) {
      // Lấy ra thông tin người tạo
      const user = await Account.findOne({
        _id: article.createdBy.account_id
      })
      if (user) {
        article['accountFullName'] = user.fullName
      }
      // Lấy ra thông tin người cập nhật gần nhất
      const updatedBy = article.updatedBy[article.updatedBy.length - 1]
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id
        })
        updatedBy['accountFullName'] = userUpdated.fullName
      }
    }
    const accounts = await Account.find({
      deleted: false
    })

    res.json({
      code: 200,
      message: 'Thành công!',
      articles: articles,
      accounts: accounts,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [POST] /admin/articles/create
export const createPost = async (req: Request, res: Response) => {
  try {
    if (req.body.position == '') {
      const countArticles = await Article.countDocuments()
      req.body.position = countArticles + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    }
    const article = new Article(req.body)
    await article.save()
    res.json({
      code: 201,
      message: 'Thêm thành công bài viết!',
      data: article,
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [GET] /admin/articles/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const article = await Article.findOne(find)
    res.json({
      code: 200,
      message: 'Thành công!',
      article: article
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  req.body.position = parseInt(req.body.position)
  try {
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await Article.updateOne(
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
      message: 'Cập nhật thành công bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status
    const id: string = req.params.id

    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    }
    await Article.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy }
      }
    )
    res.json({
      code: 200,
      message: 'Cập nhật thành công trạng thái bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/articles/change-multi
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
        await Article.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} bài viết!`
        })
        break
      case Key.INACTIVE:
        await Article.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} bài viết!`
        })
        break
      case Key.DELETEALL:
        await Article.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} bài viết!`
        })
        break
      case Key.CHANGEPOSITION:
        for (const item of ids) {
          const [id, position] = item.split('-')
          await Article.updateOne(
            { _id: { $in: id } },
            { position: Number(position), $push: { updatedBy: updatedBy } }
          )
        }
        res.json({
          code: 200,
          message: `Đổi vị trí thành công ${ids.length} bài viết!`
        })
        break
      default:
        res.json({
          code: 404,
          message: 'Không tồn tại bài viết!'
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

// [DELETE] /admin/articles/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    await Article.updateOne(
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
      message: 'Xóa thành công bài viết!'
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
