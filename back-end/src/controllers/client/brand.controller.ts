import { Request, Response } from 'express'
import Brand from '~/models/brand.model'
import mongoose from 'mongoose'

// [GET] /brands
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    // Sử dụng Aggregation Pipeline để nhóm các thương hiệu theo danh mục
    const brandsGrouped = await Brand.aggregate([
      {
        $match: { deleted: false, status: 'active' }
      },
      {
        $sort: { position: 1, title: 1 } // Sắp xếp thương hiệu
      },
      {
        // Join với collection 'brandcategories'
        $lookup: {
          from: 'brandcategories', // Tên collection của BrandCategory
          localField: 'brand_category_id',
          foreignField: '_id', // Giả sử brand_category_id là ObjectId
          as: 'category'
        }
      },
      {
        // Chuyển 'category' từ mảng thành object
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
      },
      {
        // Nhóm các thương hiệu theo tên danh mục
        $group: {
          _id: '$category.title', // Tên danh mục (vd: "Thương hiệu cao cấp")
          categorySlug: { $first: '$category.slug' },
          brands: { $push: '$$ROOT' } // Đẩy toàn bộ thông tin brand vào mảng
        }
      },
      {
        // Sắp xếp các nhóm danh mục
        $sort: { _id: 1 }
      },
      {
        // Định dạng lại output cho đẹp
        $project: {
          _id: 0,
          categoryTitle: { $ifNull: ['$_id', 'Thương hiệu khác'] }, // Nếu brand không có danh mục
          categorySlug: '$categorySlug',
          brands: '$brands'
        }
      }
    ])

    res.json({
      code: 200,
      message: 'Lấy danh sách thương hiệu thành công!',
      data: brandsGrouped
    })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thương hiệu:", error)
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}
