import { Router } from "express";
const router: Router = Router();

// Upload ảnh
import multer from "multer";
import uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
// Upload ảnh

import * as controller from "../../controllers/admin/product.controller";
import * as validate from "../../validates/admin/product.validate";

router.get("/", controller.product);

// router.patch("/change-status/:status/:id", controller.changeStatus);

// router.patch("/change-multi", controller.changeMulti);

// router.delete("/delete/:id", controller.deleteItem);

// // Khi click vào nút thêm mới, web chuyển hướng sang trang thêm mới sản phẩm.
// router.get("/create", controller.create);
// // Bắt đẩu thêm mới sản phẩm và gửi form đi.
// router.post(
//   "/create",
//   multer().single("thumbnail"),
//   uploadCloud
//   validate.createPost, // middleware
//   controller.createPost
// );

// // Khi click vào nút chỉnh sửa, web chuyển hướng sang trang chỉnh sửa sản phẩm.
// router.get("/edit/:id", controller.edit);
// // Bắt đầu chỉnh sửa sản phẩm và gửi form đi.
// router.patch(
//   "/edit/:id",
//   multer().single("thumbnail"),
//   uploadCloud,
//   validate.createPost, // middleware
//   controller.editPatch
// );

// router.get("/detail/:id", controller.detail);

export const productRoutes: Router = router;
