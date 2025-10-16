import { Request, Response } from 'express'
import Product from '~/models/product.model'
import ProductCategory from '~/models/product-category.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'

// [GET] /products
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = { deleted: false }

    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.regex || objectSearch.slug) {
      find.$or = [
        { title: objectSearch.regex },
        { slug: objectSearch.slug }
      ]
    }
    // End search
    
    // Pagination
    const countProducts = await Product.countDocuments(find)
    const objectPagination = paginationHelpers(
      { currentPage: 1, limitItems: 16 },
      req.query,
      countProducts
    )
    // End Pagination

    const allProducts = await Product
      .find(find)
      .sort({ position: 'desc' })
    const products = await Product
      .find(find)
      .sort({ position: 'desc' })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)

    const newProducts = productsHelper.priceNewProducts(
      products as OneProduct[]
    )
    
    res.json({
      code: 200,
      message: 'Thành công!',
      products: newProducts,
      pagination: objectPagination,
      allProducts: allProducts,
      keyword: objectSearch.keyword,
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

    const products = await Product
      .find({
        deleted: false,
        product_category_id: { $in: [category.id, ...listSubCategoryId] }
      })
      .sort({ position: 'desc' })

    const newProducts = productsHelper.priceNewProducts(
      products as OneProduct[]
    )

    res.json({
      code: 200,
      message: 'Thành công!',
      products: newProducts,
      pageTitle: category.title
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
    const product = await Product
      .findOne(find)
      .populate('comments.user_id')
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

// [GET] /products/suggestions
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string
    const find: any = { deleted: false, status: 'active' }
    if (!keyword || !keyword.trim()) {
      return res.json({ code: 200, products: [] })
    }
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.regex || objectSearch.slug) {
      find.$or = [
        { title: objectSearch.regex },
        { slug: objectSearch.slug }
      ]
    }
    const products = await Product
      .find(find)
      .select('title thumbnail price discountPercentage slug')
      .limit(20)

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

// [GET] /products/related/:productId
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId

    // 1. Tìm sản phẩm hiện tại để lấy category_id
    const currentProduct = await Product.findById(productId)

      // Nếu không tìm thấy sản phẩm hoặc sản phẩm không có danh mục, trả về mảng rỗng
    if (!currentProduct || !currentProduct.product_category_id) {
      return res.json({ code: 200, products: [] })
    }

    // 2. Tìm các sản phẩm khác có cùng category_id
    const relatedProducts = await Product.find({
      product_category_id: currentProduct.product_category_id,
      _id: { $ne: productId } // $ne: loại trừ chính sản phẩm đang xem
    }).limit(8) // Giới hạn 8 sản phẩm liên quan

    // 3. Tính toán lại giá mới cho các sản phẩm
    const newProducts = productsHelper.priceNewProducts(
      relatedProducts as OneProduct[]
    )

    res.json({
      code: 200,
      message: 'Thành công!',
      products: newProducts
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error })
  }
}

// [POST] /products/:productId/reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId
    const userId = req["accountUser"].id // Lấy từ middleware xác thực
    const { rating, content, color, size } = req.body
    const images = req['fileUrls'] || [] // Lấy URL ảnh từ middleware uploadCloud

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ code: 404, message: 'Không tìm thấy sản phẩm.' })
    }

    const newReview = {
      user_id: userId,
      rating: Number(rating),
      content: content,
      images: images,
      color: color,
      size: size,
      status: 'approved' // Hoặc 'pending' nếu bạn muốn duyệt
    }

    // Thêm đánh giá mới vào sản phẩm
    product.comments.push(newReview)

    // Tính toán lại điểm sao trung bình
    let totalRating = 0
    const approvedComments = product.comments.filter(c => c.status === 'approved')
    
    approvedComments.forEach(comment => {
      totalRating += comment.rating
    })

    product.stars.count = approvedComments.length
    product.stars.average = approvedComments.length > 0 ? totalRating / approvedComments.length : 0

    await product.save()

    res.json({ code: 201, message: 'Gửi đánh giá thành công!' })

  } catch (error) {
    console.error("LỖI KHI TẠO REVIEW:", error)
    res.json({ code: 400, message: 'Lỗi!', error })
  }
}