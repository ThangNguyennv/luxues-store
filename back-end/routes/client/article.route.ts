import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/article.controller";

router.get("/", controller.index);
router.get("/:slugCategory", controller.category);
// router.get("/detail/:slugArticle", controller.detail);

export const articleRoutes: Router = router;
