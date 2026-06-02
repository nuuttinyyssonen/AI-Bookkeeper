import { loginController } from "../controllers/login.controller";
import { Router } from "express";
import { standardRateLimiterMiddleware } from "../middleware/rateLimiter";

// Router
const loginRouter = Router();

// Route uses loginController and logs user in
loginRouter.post("/", standardRateLimiterMiddleware("login"), loginController);

export default loginRouter;