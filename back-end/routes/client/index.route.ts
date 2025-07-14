import { Express } from "express";
import { homeRoutes } from "./home.route";
import { productRoutes } from "./product.route";
import * as userMiddleware from "../../middlewares/client/user.middleware";
import * as categoryMiddleware from "../../middlewares/client/category.middleware";
import * as cartMiddleware from "../../middlewares/client/cart.middleware";
import * as settingMiddleware from "../../middlewares/client/setting.middleware";
import * as authMiddleware from "../../middlewares/client/auth.middleware";

import { articleRoutes } from "./article.route";
import { searchRoutes } from "./search.route";
import { cartRoutes } from "./cart.route";
import { checkoutRoutes } from "./checkout.route";
import { userRoutes } from "./user.route";
// import chatRoutes from "./chat.route";

const routeClient = (app: Express): void => {
  // Middleware để lấy danh mục sản phẩm và bài viết
  app.use(categoryMiddleware.category);
  app.use(categoryMiddleware.categoryArticle);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingsGeneral);

  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/articles", articleRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
  // app.use("/chat", authMiddleware.requireAuth, chatRoutes);
};

// app.use() -> Đi vào router con thì có thể là các phương thức khác
// app.get() -> Nhược điểm: Cố định router cha là get() thì các router con cũng là get() -> không linh hoạt
export default routeClient;
