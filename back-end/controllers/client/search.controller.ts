import { Request, Response } from 'express'
import Product from '../../models/product.model'
import * as productsHelper from '../../helpers/product'
import { OneProduct } from '../../helpers/product'

interface ObjectSearch {
  keyword: string;
  regex?: RegExp;
}
// [GET] /search
export const index = async (req: Request, res: Response) => {
  try {
    const objectSearch: ObjectSearch = {
      keyword: ''
    }
    let newProducts = []
    if (req.query.keyword) {
      objectSearch.keyword = req.query.keyword as string | never
      const regex = new RegExp(objectSearch.keyword, 'i')
      const products = await Product.find({
        title: regex,
        deleted: false,
        status: 'active'
      })
      newProducts = productsHelper.priceNewProducts(products as OneProduct[])
    }
    res.json({
      code: 200,
      message: 'Thành công!',
      keyword: objectSearch.keyword,
      products: newProducts
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
