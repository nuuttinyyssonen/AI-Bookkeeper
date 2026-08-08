'use server';

import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

export const getChatRooms = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assistant`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        // if (response.status === 403) {
        //     redirect('/pricing?message=subscription_required');
        // }

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message ?? "Something went wrong" };
        }

        return data;
    } catch (error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" };
    }
};

export const getChatMessages = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assistant/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        // if (response.status === 403) {
        //     redirect('/pricing?message=subscription_required');
        // }

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message ?? "Something went wrong" };
        }

        return data;
    } catch (error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" };
    }
};

export const createChatMessage = async (id: string, message: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/assistant/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({message}),
        });

        if (response.status === 403) {
            redirect('/pricing?message=subscription_required');
        }

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message ?? "Something went wrong" };
        }

        return data;
    } catch (error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" };
    }
};

export const streamChatMessage = async (id: string, message: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/assistant/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status === 403) {
            redirect('/pricing?message=subscription_required');
        }

        if (!response.ok) {
            return { error: "Something went wrong" };
        }

        return response.body;
    } catch(error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" }
    }
};

export const createNewChatRoom = async (message: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const response = await fetch(`http://localhost:5001/api/assistant/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status === 403) {
            redirect('/pricing?message=subscription_required');
        }

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message ?? "Something went wrong" };
        }

        return data;
    } catch(error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" };
    }
};

export const deleteChatRoom = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/assistant/${id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (response.status === 403) {
            redirect('/pricing?message=subscription_required');
        }

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message ?? "Something went wrong" };
        }

        return data;
    } catch (error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" };
    }
};