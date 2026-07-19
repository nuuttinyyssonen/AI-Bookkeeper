import { deleteUserByEmail, grantSubscription } from "../controllers/cypress.controller";
import { Router } from "express";
import { rateLimiters } from "../utils/rateLimiter";

const cypressRouter = Router();

cypressRouter.delete('/', rateLimiters.read("cypress_e2e_delete"), deleteUserByEmail);
cypressRouter.post('/grant-subscription', rateLimiters.read("cypress_e2e_post"), grantSubscription);

export default cypressRouter;