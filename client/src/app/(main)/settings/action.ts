'use server';

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        return { error: "Something went wrong. Please try again." };
    }
};

export const updateUserData = async (first_name: string, last_name: string, email: string, phonenumber: string, business_id: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/user", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({ first_name, last_name, email, phonenumber, business_id })
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Something went wrong" };
        };

        const data = await response.json();
        revalidatePath("/settings")
        return data;
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }
};

export const cancelSubscription = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/subscription/delete", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Something went wrong" };
        };

        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1500));
        revalidatePath("/settings")
        return data;
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }
};

export const reactivateSubscription = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/subscription/revoke-plan", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Something went wrong" };
        };

        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1500));
        revalidatePath("/settings")
        return data;
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }
};

export const deleteAccount = async (_prevState: { error?: string } | undefined) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/user", {
            method: 'DELETE',
            headers: {
                'Cookie': `token=${token}`
            },
        });

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Something went wrong" };
        };

        await response.json();
        cookieStore.delete("token");
        cookieStore.set("account_deleted", "1", { maxAge: 30, path: "/" });
    } catch(error) {
        return { error: "Something went wrong. Please try again." };
    }

    redirect("/account-deleted");
};