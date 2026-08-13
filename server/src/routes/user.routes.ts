import { getUserData, updateUserData, deleteUser, getUserSubscription, updatePushToken } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { Router } from "express";

// Router
const userRouter = Router();

userRouter.get("/", authMiddleware, rateLimiters.read("get_user_data"), getUserData);
userRouter.put("/", authMiddleware, rateLimiters.write("update_user_data"), updateUserData);
userRouter.delete("/", authMiddleware, rateLimiters.sensitive("delete_user"), deleteUser);
userRouter.get("/subscription", authMiddleware, rateLimiters.read("get_subscription"), getUserSubscription);
userRouter.put("/push-token", authMiddleware, rateLimiters.write("push-token"), updatePushToken);

export default userRouter;