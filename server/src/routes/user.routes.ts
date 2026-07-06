import { getUserData, updateUserData, deleteUser, getUserSubscription } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { Router } from "express";

// Router
const userRouter = Router();

userRouter.get("/", authMiddleware, rateLimiters.read("get_user_data"), getUserData);
userRouter.put("/", authMiddleware, rateLimiters.write("update_user_data"), updateUserData);
userRouter.delete("/", authMiddleware, rateLimiters.sensitive("delete_user"), deleteUser);
userRouter.get("/subscription", authMiddleware, rateLimiters.read("get_subscription"), getUserSubscription);

export default userRouter;