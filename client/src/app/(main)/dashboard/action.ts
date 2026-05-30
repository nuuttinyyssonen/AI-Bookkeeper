'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutUser = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Sending logout request to our backend API route.
        const response = await fetch("http://localhost:3001/api/auth/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        });

        // If response is not ok, return error message from server or a default one.
        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Invalid Credentials" };
        }

        // Removing token from cookie
        cookieStore.delete("token");
    } catch (error) {
        console.error(error);
    }
    redirect("/login")
}