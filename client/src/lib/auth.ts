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