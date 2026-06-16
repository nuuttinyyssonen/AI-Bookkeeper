import express from "express";
import "./types/express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import helmet from 'helmet';

import loginRouter from "./routes/login.routes";
import signupRouter from "./routes/signup.routes";
import logoutRouter from "./routes/logout.routes";
import storageRouter from "./routes/storage.routes";
import receiptRouter from "./routes/receipt.routes";
import dashboardRouter from "./routes/dashboard.routes";
import reportRouter from "./routes/report.routes";
import assistantRouter from "./routes/assistant.routes";

import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

dotenv.config();

const app = express();

// CORS configuration to allow requests from frontend
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? "https://aibookkeeper.fi" 
        : "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Winston request logger
app.use(requestLogger);

// Routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/signup', signupRouter);
app.use('/api/auth/logout', logoutRouter);
app.use('/api/storage', storageRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/report', reportRouter);
app.use('/api/assistant', assistantRouter);

// Error handler middleware
app.use(errorHandler);

export default app;
