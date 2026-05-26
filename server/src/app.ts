import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import loginRouter from "./routes/login.routes";
import signupRouter from "./routes/signup.routes";
import logoutRouter from "./routes/logout.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/signup', signupRouter);
app.use('/api/auth/logout', logoutRouter);

export default app;