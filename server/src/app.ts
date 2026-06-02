import express from "express";
import "./types/express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import loginRouter from "./routes/login.routes";
import signupRouter from "./routes/signup.routes";
import logoutRouter from "./routes/logout.routes";
import storageRouter from "./routes/storage.routes";
import ocrRouter from "./routes/ocr.routes";
import receiptRouter from "./routes/receipt.routes";

import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/signup', signupRouter);
app.use('/api/auth/logout', logoutRouter);
app.use('/api/storage', storageRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/receipt', receiptRouter);

app.use(errorHandler);

export default app;
