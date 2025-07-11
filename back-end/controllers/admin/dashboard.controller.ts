import { Request, Response } from "express";
import CategoryProduct from "../../models/product-category.model";
import Product from "../../models/product.model";
import Account from "../../models/account.model";
import User from "../../models/user.model";

// [GET] /admin/dashboard
export const dashboard = async (req: Request, res: Response) => {
  try {
    const statistic = {
      categoryProduct: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      product: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      account: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      user: {
        total: 0,
        active: 0,
        inactive: 0,
      },
    };

    statistic.categoryProduct.total = await CategoryProduct.countDocuments({
      deleted: false,
    });
    statistic.categoryProduct.active = await CategoryProduct.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.categoryProduct.inactive = await CategoryProduct.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.product.total = await Product.countDocuments({
      deleted: false,
    });
    statistic.product.active = await Product.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.product.inactive = await Product.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.account.total = await Account.countDocuments({
      deleted: false,
    });
    statistic.account.active = await Account.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.account.inactive = await Account.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.user.total = await User.countDocuments({
      deleted: false,
    });
    statistic.user.active = await User.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.user.inactive = await User.countDocuments({
      deleted: false,
      status: "inactive",
    });
    res.json({
      code: 400,
      message: "Thành công!",
      statistic: statistic,
    });
  } catch (error) {
    res.json({
      code: 200,
      message: "Lỗi!",
    });
  }
};
