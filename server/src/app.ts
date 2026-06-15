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
import dashboardRouter from "./routes/dashboard.routes";
import reportRouter from "./routes/report.routes";

import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Winston request logger
app.use(requestLogger);

// Routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/signup', signupRouter);
app.use('/api/auth/logout', logoutRouter);
app.use('/api/storage', storageRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/report', reportRouter);

// Error handler middleware
app.use(errorHandler);

export default app;
