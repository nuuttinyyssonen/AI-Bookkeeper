import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const authenticateUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token) {
        redirect("/login");
    }

    return token;
};