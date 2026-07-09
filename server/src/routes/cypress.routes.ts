import { deleteUserByEmail, grantSubscription } from "../controllers/cypress.controller";
import { Router } from "express";

const cypressRouter = Router();

cypressRouter.delete('/', deleteUserByEmail);
cypressRouter.post('/grant-subscription', grantSubscription);

export default cypressRouter;