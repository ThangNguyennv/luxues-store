import { Request, Response } from 'express'
import BrandCategory from '~/models/brand-category.model'
import { buildTree, TreeItem } from '~/helpers/createTree'

// [GET] /admin/brands-category
export const index = async (req: Request, res: Response) => {
  try {
    const categories = await BrandCategory.find({
      deleted: false
    });
    // Giống như product-category, chúng ta tạo một cây
    const tree = buildTree(categories as unknown as TreeItem[]);
    res.json({ code: 200, message: 'Thành công!', categories: tree });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [POST] /admin/brands-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = {
      account_id: req['accountAdmin'].id
    };

    const category = new BrandCategory(req.body);
    await category.save();
    res.json({ code: 201, message: 'Tạo mới danh mục thương hiệu thành công!', data: category });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [GET] /admin/brands-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const category = await BrandCategory.findById(req.params.id);
    if (!category) {
      return res.json({ code: 404, message: 'Không tìm thấy danh mục.' });
    }
    res.json({ code: 200, message: 'Thành công!', category: category });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}

// [PATCH] /admin/brands-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    delete req.body.updatedBy
    const updatedBy = {
      account_id: req['accountAdmin'].id,
      updatedAt: new Date()
    };
    await BrandCategory.updateOne(
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

// [DELETE] /admin/brands-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deletedBy = {
      account_id: req['accountAdmin'].id,
      deletedAt: new Date()
    };
    await BrandCategory.updateOne(
      { _id: req.params.id },
      { deleted: true, deletedBy: deletedBy }
    );
    res.json({ code: 200, message: 'Xóa thành công!' });
  } catch (error) {
    res.json({ code: 400, message: 'Lỗi!', error: error.message });
  }
}
