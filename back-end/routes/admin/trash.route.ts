import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/trash.controller";

router.get("/", controller.trash);

// router.patch("/change-status/:status/:id", controller.changeStatus);

// router.delete("/permanently-delete/:id", controller.permanentlyDeleteItem);
// router.delete("/change-multi", controller.changeMulti);

// router.patch("/recover/:id", controller.recoverItem);

export const trashRoutes: Router = router;
