import { signupController } from "../controllers/signup.controller";
import { Router } from "express";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const signupRouter = Router();

// Router uses signupController function and creates new user to database.
signupRouter.post("/", rateLimiters.sensitive("signup"), signupController);

export default signupRouter