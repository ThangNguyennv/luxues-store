import { Request, Response, NextFunction } from 'express'
import ProductCategory from '~/models/product-category.model'
import ArticleCategory from '~/models/article-category.model'
import { tree, TreeItem } from '~/helpers/createTree'

export const category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsCategory = await ProductCategory.find({
    deleted: false
  })
  const newProductsCategory = tree(productsCategory as unknown as TreeItem[])
  req['layoutProductsCategory'] = newProductsCategory // biến local để sử dụng trong layout, file pug
  next()
}

export const categoryArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const articlesCategory = await ArticleCategory.find({
    deleted: false
  })
  const newArticlesCategory = tree(articlesCategory as unknown as TreeItem[])
  req['layoutArticlesCategory'] = newArticlesCategory // biến local để sử dụng trong layout, file pug
  next()
}
