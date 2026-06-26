import { getUserData, updateUserData } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { Router } from "express";

// Router
const userRouter = Router();

userRouter.get("/", authMiddleware, rateLimiters.read("get_user_data"), getUserData);
userRouter.put("/", authMiddleware, rateLimiters.write("update_user_data"), updateUserData);

export default userRouter;