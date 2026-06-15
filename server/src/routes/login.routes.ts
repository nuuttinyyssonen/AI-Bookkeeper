import { loginController } from "../controllers/login.controller";
import { Router } from "express";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const loginRouter = Router();

// Route uses loginController and logs user in
loginRouter.post("/", rateLimiters.sensitive("login"), loginController);

export default loginRouter;