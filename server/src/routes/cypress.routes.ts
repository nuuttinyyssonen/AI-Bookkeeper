import { deleteUserByEmail } from "../controllers/cypress.controller";
import { Router } from "express";

const cypressRouter = Router();

cypressRouter.delete('/', deleteUserByEmail);

export default cypressRouter;