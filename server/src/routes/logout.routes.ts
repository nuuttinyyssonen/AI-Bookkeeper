import { Router } from "express";
import { logoutController } from "../controllers/logout.controller";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const logoutRouter = Router();

// Uses logoutController that clears cookie and logs user out from Supabase.
logoutRouter.post('/', rateLimiters.write("logout"), logoutController);

export default logoutRouter;