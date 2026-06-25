import express, { Router } from "express";
import { webhookEndpoint } from "../controllers/webhook.controller";

// Router
const webhookRouter = Router();

webhookRouter.post('/webhook', express.raw({ type: 'application/json' }), webhookEndpoint);

export default webhookRouter;