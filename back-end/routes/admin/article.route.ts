import express, { Router } from "express";
const router: Router = Router();
// Upload ảnh
import multer from "multer";
import uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
// Upload ảnh

import * as validate from "../../validates/admin/product.validate";
import * as controller from "../../controllers/admin/article.controller";

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

// router.delete("/delete/:id", controller.deleteItem);

router.post(
  "/create",
  multer().single("thumbnail"),
  uploadCloud,
  validate.createPost, // middleware
  controller.createPost
);

router.get("/detail/:id", controller.detail);

router.patch(
  "/edit/:id",
  multer().single("thumbnail"),
  uploadCloud,
  validate.createPost, // middleware
  controller.editPatch
);

export const articleRoutes: Router = router;
