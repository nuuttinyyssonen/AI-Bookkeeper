import { getUserData, updateUserData, deleteUser, getUserSubscription } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { Router } from "express";
import { demoMiddleware } from "../middleware/demoMiddleware";

// Router
const userRouter = Router();

userRouter.get("/", demoMiddleware, rateLimiters.read("get_user_data"), getUserData);
userRouter.put("/", demoMiddleware, rateLimiters.write("update_user_data"), updateUserData);
// userRouter.delete("/", authMiddleware, rateLimiters.sensitive("delete_user"), deleteUser);
// userRouter.get("/subscription", authMiddleware, rateLimiters.read("get_subscription"), getUserSubscription);

export default userRouter;