import { sendPasswordResetLink, resetPassword } from "../controllers/password-reset.controller";
import { Router } from "express";
import { rateLimiters } from "../utils/rateLimiter";

// Router
const passwordResetRouter = Router();

passwordResetRouter.post('/send-email', rateLimiters.write("send-password-reset-link"), sendPasswordResetLink);
passwordResetRouter.post('/:id', rateLimiters.write('reset-password'), resetPassword);

export default passwordResetRouter