import { Router } from "express";
const router: Router = Router();
// Upload ảnh
import multer from "multer";
import uploadCloud from "../../middlewares/client/uploadCloud.middleware";
// Hết Upload ảnh

import * as controller from "../../controllers/client/user.controller";
import * as validate from "../../validates/client/user.validate";
import * as authMiddleware from "../../middlewares/client/auth.middleware";

router.post("/register", validate.registerPost, controller.registerPost);

// router.post("/login", validate.loginPost, controller.loginPost);

// router.get("/logout", controller.logout);

// router.post(
//   "/password/forgot",
//   validate.forgotPasswordPost,
//   controller.forgotPasswordPost
// );

// router.post("/password/otp", controller.otpPasswordPost);

// router.post(
//   "/password/reset",
//   validate.resetPasswordPost,
//   controller.resetPasswordPost
// );

// // route private
// router.get("/info", authMiddleware.requireAuth, controller.info);
// router.patch(
//   "/info/edit",
//   multer().single("avatar"),
//   uploadCloud,
//   validate.editPatch,
//   controller.editPatch
// );

// router.patch(
//   "/info/edit/change-password",
//   validate.changePasswordPatch,
//   controller.changePasswordPatch
// );

export const userRoutes: Router = router;
