import systemConfig from "../../config/system";

// import { authMiddleware } from "../../middlewares/admin/auth.middleware";

// import { dashboardRoutes } from "./dashboard.route";
// import { productRoutes } from "./product.route";
// import { trashRoutes } from "./trash.route";
// import { productCategoryRoutes } from "./product-category.route";
// import { roleRoutes } from "./role.route";
import { accountRoutes } from "./account.route";
// import { userRoutes } from "./user.route";
// import { authRoutes } from "./auth.route";
// import { myAccountRoutes } from "./my-account.route";
// import { articleRoutes } from "./article.route";
// import { articleCategoryRoutes } from "./article-category.route";
// import { orderRoutes } from "./order.route";
// import { settingRoutes } from "./setting.route";

const routeAdmin = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + "/accounts", accountRoutes);
};
export default routeAdmin;
