import { Router } from "express";
import { logoutController } from "../controllers/logout.controller";
import { standardRateLimiterMiddleware } from "../middleware/rateLimiterMiddleware";

// Router
const logoutRouter = Router();

// Uses logoutController that clears cookie and logs user out from Supabase.
logoutRouter.post('/', standardRateLimiterMiddleware("logout"), logoutController);

export default logoutRouter;