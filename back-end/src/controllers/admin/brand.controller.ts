import { Request, Response } from 'express'
import Brand from '~/models/brand.model'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'

// [GET] /admin/brands
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = { deleted: false }
    
    // Search
    const objectSearch = searchHelpers(req.query)
    if (objectSearch.regex) {
      find.title = objectSearch.regex
    }
    // End search

    // Pagination
    const countBrands = await Brand.countDocuments(find)
    const objectPagination = paginationHelpers(
      { currentPage: 1, limitItems: 10 },
      req.query,
      countBrands
    )
    // End Pagination

    const brands = await Brand
      .find(find)
      .sort({ position: 'desc' })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
    
    res.json({
      code: 200,
      message: 'Thành công!',
      brands: brands,
      pagination: objectPagination
    })
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}

// [POST] /admin/brands/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    };

    const brand = new Brand(req.body);
    await brand.save();
    res.json({ code: 201, message: 'Tạo mới thương hiệu thành công!', data: brand });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [GET] /admin/brands/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.json({ code: 404, message: 'Không tìm thấy thương hiệu.' });
    }
    res.json({ code: 200, message: 'Thành công!', brand: brand });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [PATCH] /admin/brands/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    delete req.body.updatedBy
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    };

    // `req.body` đã chứa `thumbnail` nếu có file mới
    await Brand.updateOne(
      { _id: req.params.id },
      { 
        ...req.body,
        $push: { updatedBy: updatedBy }
      }
    );
    res.json({ code: 200, message: 'Cập nhật thành công!' });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [DELETE] /admin/brands/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deletedBy = {
      account_id: req['accountAdmin'].id,
      deletedAt: new Date()
    };
    await Brand.updateOne(
      { _id: req.params.id },
      { deleted: true, deletedBy: deletedBy }
    );
    res.json({ code: 200, message: 'Xóa thành công!' });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}
