import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/user.controller";
// Upload ảnh
import multer from "multer";
import uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
// Upload ảnh
import * as validate from "../../validates/admin/account.validate";

router.get("/", controller.index);

// router.patch("/change-status/:status/:id", controller.changeStatus);

// router.patch(
//   "/edit/:id",
//   multer().single("avatar"),
//   uploadCloud,
//   validate.editPatch, // middleware
//   controller.editPatch
// );
// router.get("/detail/:id", controller.detail);
// router.delete("/delete/:id", controller.deleteItem);

export const userRoutes: Router = router;
