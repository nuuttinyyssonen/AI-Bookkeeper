import { Router } from "express";
import { logoutController } from "../controllers/logout.controller";

// Router
const logoutRouter = Router();

// Uses logoutController that clears cookie and logs user out from Supabase.
logoutRouter.post('/', logoutController);

export default logoutRouter;