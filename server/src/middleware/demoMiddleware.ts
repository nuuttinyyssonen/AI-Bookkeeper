import { NextFunction, Request, Response } from "express";

export const demoMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.user = {
        id: "demo-user-fixed-id",
        email: "demo@aibookkeeper.fi",
        password: "",
        first_name: "Demo",
        last_name: "Käyttäjä",
        phonenumber: "",
        supabase_id: null,
        business_id: "1234567-8",
    };
    next();
};