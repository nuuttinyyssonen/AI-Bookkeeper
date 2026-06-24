import { signupController, deleteUser } from "../controllers/signup.controller";
import { Router } from "express";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const signupRouter = Router();

// Router uses signupController function and creates new user to database.
signupRouter.post("/", rateLimiters.sensitive("signup"), signupController);
signupRouter.delete('/:id', rateLimiters.sensitive("signup_fall_back_delete"), deleteUser);

export default signupRouter