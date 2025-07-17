import { Request, Response } from 'express'
import Product from '../../models/product.model'
import ProductCategory from '../../models/product-category.model'
import * as productsHelper from '../../helpers/product'
import { OneProduct } from '../../helpers/product'

// [GET] /products
export const index = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      deleted: false
    }).sort({ position: 'desc' })

    const newProducts = productsHelper.priceNewProducts(
      products as OneProduct[]
    )
    res.json({
      code: 200,
      message: 'Thành công!',
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

// [GET] /products/:slugCategory
export const category = async (req: Request, res: Response) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      status: 'active',
      deleted: false
    })

    const getSubCategory = async (parentId) => {
      const subs = await ProductCategory.find({
        deleted: false,
        status: 'active',
        parent_id: parentId
      })
      let allSub = [...subs] // Cú pháp trải ra (spread syntax)

      for (const sub of subs) {
        const childs = await getSubCategory(sub.id) // Gọi đệ quy để lấy tất cả các danh mục con
        allSub = allSub.concat(childs) // Nối mảng con vào mảng cha
      }
      return allSub
    }

    const listSubCategory = await getSubCategory(category.id)

    const listSubCategoryId = listSubCategory.map((item) => item.id)

    const products = await Product.find({
      deleted: false,
      product_category_id: { $in: [category.id, ...listSubCategoryId] }
    }).sort({ position: 'desc' })

    const newProducts = productsHelper.priceNewProducts(
      products as OneProduct[]
    )
    res.json({
      code: 200,
      message: 'Thành công!',
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

// [GET] /products/detail/:slugProduct
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: 'active'
    }

    const product = await Product.findOne(find)

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: 'active'
      })
      product['category'] = category
    }
    product['priceNew'] = productsHelper.priceNewProduct(product as OneProduct)
    res.json({
      code: 200,
      message: 'Thành công!',
      product: product
    })
  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}
