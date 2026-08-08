import { NextFunction, Request, Response } from "express";
import { seedDemoData } from "../demo-seed";

const DEMO_USER = {
    id: "demo-user-fixed-id",
    email: "demo@aibookkeeper.fi",
    password: "",
    first_name: "Demo",
    last_name: "Käyttäjä",
    phonenumber: "",
    supabase_id: null,
    business_id: "1234567-8",
};

const SESSION_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

let lastActivityAt = 0;
let seedingPromise: Promise<void> | null = null;

export const demoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const isNewSession = now - lastActivityAt > SESSION_IDLE_TIMEOUT_MS;
    lastActivityAt = now;

    if (isNewSession && !seedingPromise && req.method === "GET") {
        seedingPromise = seedDemoData()
            .catch((error) => console.error("Demo data reset failed:", error))
            .finally(() => { seedingPromise = null; });
    }

    if (seedingPromise) {
        await seedingPromise;
    }

    req.user = DEMO_USER;
    next();
};
