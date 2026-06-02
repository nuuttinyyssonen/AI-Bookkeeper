import { signupController } from "../controllers/signup.controller";
import { Router } from "express";
import { standardRateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";

// Router
const signupRouter = Router();

// Router uses signupController function and creates new user to database.
signupRouter.post("/", standardRateLimiterMiddleware("signup"), signupController);

export default signupRouter