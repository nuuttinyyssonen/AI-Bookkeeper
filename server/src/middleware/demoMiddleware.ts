import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export const demoMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies?.demo_session ?? crypto.randomUUID();
    res.cookie("demo_session", sessionId, { maxAge: 3600000 }); // 1h
    req.user = {
        id: `demo-${sessionId}`,
        email: "demo@aibookkeeper.fi",
        password: "",
        first_name: "Demo",
        last_name: "Käyttäjä",
        phonenumber: "",
        supabase_id: null,
        business_id: "demo",
    };
    next();
};