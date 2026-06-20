'use server';

import { cookies } from "next/headers";

export const getChatRooms = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch("http://localhost:5001/api/assistant", {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (!response.ok) {
            console.log("Error in getting chat history", response.status);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return
    }
};

export const getChatMessages = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/assistant/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (!response.ok) {
            console.log("Error in getting chat messages", response.status);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return
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

        if (!response.ok) {
            console.log("Error in sending message", response.status);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return
    }
};

export const streamChatMessage = async (id: string, message: string) => {
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

    return response.body; // return the raw stream
};

export const createNewChatRoom = async (message: string) => {
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

    return response.body; // return the raw stream
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

        if (!response.ok) {
            console.log("Error in deleting chat", response.status);
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return
    }
};