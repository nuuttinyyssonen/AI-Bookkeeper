'use server';

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const getUserData = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/user", {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || "Invalid or expired session token" };
        };

        const data = await response.json();
        return data;
    } catch(error) {
        console.error(error);
    }
};

export const updateUserData = async (first_name: string, last_name: string, email: string, phonenumber: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/user", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({ first_name, last_name, email, phonenumber })
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Something went wrong" };
        };

        const data = await response.json();
        revalidatePath("/settings")
        return data;
    } catch(error) {
        console.error(error);
    }
};