import { Router } from "express";

const router: Router = Router();

import * as controller from "../../controllers/admin/role.controller";
import * as validate from "../../validates/admin/product.validate";

router.get("/", controller.index);
router.post("/create", validate.createPost, controller.createPost);
router.patch(
  "/edit/:id",
  validate.createPost, // middleware
  controller.editPatch
);
router.delete("/delete/:id", controller.deleteItem);
// router.get("/detail/:id", controller.detail);
// router.patch("/permissions", controller.permissionsPatch);

export const roleRoutes: Router = router;
