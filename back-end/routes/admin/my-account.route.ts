import express, { Router } from "express";
const router: Router = Router();
// Upload ảnh
import multer from "multer";
import uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
// Upload ảnh
import * as validate from "../../validates/admin/account.validate.js";

import * as controller from "../../controllers/admin/my-account.controller";

router.get("/", controller.index); // detail
// router.get("/edit", controller.edit);
// // Bắt đầu chỉnh sửa sản phẩm và gửi form đi.
// router.patch(
//   "/edit",
//   multer().single("avatar"),
//   uploadCloud,
//   validate.editPatch, // middleware
//   controller.editPatch
// );
export const myAccountRoutes: Router = router;
