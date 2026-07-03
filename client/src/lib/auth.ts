import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Middleware function to authenticate user by checking for JWT token in cookies
export const authenticateUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token) {
        redirect("/login");
    }

    return token;
};

// Check if a valid Vero authorization token exists in cookies
export const getVeroAuthToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("vero_auth_token")?.value;
    const expiresAt = cookieStore.get("vero_auth_expires")?.value;

    if (!token || !expiresAt) return null;

    if (new Date(expiresAt) <= new Date()) return null;

    return token;
};