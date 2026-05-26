import { loginController } from "../controllers/login.controller";
import { Router } from "express";

// Router
const loginRouter = Router();

// Route uses loginController and logs user in
loginRouter.post("/", loginController);

export default loginRouter;