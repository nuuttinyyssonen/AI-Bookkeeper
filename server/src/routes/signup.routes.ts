import { signupController } from "../controllers/signup.controller";
import { Router } from "express";

// Router
const signupRouter = Router();

// Router uses signupController function and creates new user to database.
signupRouter.post("/", signupController);

export default signupRouter