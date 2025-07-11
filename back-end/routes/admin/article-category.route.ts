import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/article-category.controller";

// Upload ảnh
import multer from "multer";
import uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
// Upload ảnh

import * as validate from "../../validates/admin/products-category.validate";

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

// router.patch("/change-multi", controller.changeMulti);

// router.delete("/delete/:id", controller.deleteItem);

// router.get("/create", controller.create);

// router.post(
//   "/create",
//   upload.single("thumbnail"),
//   uploadCloud.upload,
//   validate.createPost, // middleware
//   controller.createPost
// );

// // Khi click vào nút chỉnh sửa, web chuyển hướng sang trang chỉnh sửa sản phẩm.
// router.get("/edit/:id", controller.edit);
// // Bắt đầu chỉnh sửa sản phẩm và gửi form đi.
// router.patch(
//   "/edit/:id",
//   upload.single("thumbnail"),
//   uploadCloud.upload,
//   validate.createPost, // middleware
//   controller.editPatch
// );

// router.get("/detail/:id", controller.detail);

export const articleCategoryRoutes: Router = router;
