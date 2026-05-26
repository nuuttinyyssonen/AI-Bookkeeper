import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

import loginRouter from "./routes/login.routes";
import signupRouter from "./routes/signup.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/signup', signupRouter);

export default app;