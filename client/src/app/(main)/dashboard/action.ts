'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutUser = async (_prevState: { error?: string } | null, _formData: FormData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Sending logout request to our backend API route.
        const response = await fetch("http://localhost:5001/api/auth/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            }
        });

        // If response is not ok, return error message from server or a default one.
       if (!response.ok) {
            const data = await response.json();
            return { error: data.error || "Invalid or expired session token" };
        }

        // Removing token from cookie
        cookieStore.delete("token");
    } catch (error) {
        console.error(error);
    }
    redirect("/login?message=logged-out");
}

export const getDashboardData = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Sending logout request to our backend API route.
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        // If response is not ok, return error message from server or a default one.
       if (!response.ok) {
            const data = await response.json();
            return { error: data.error || "Invalid or expired session token" };
        }

        const data = await response.json();
        return {
            revenue: Number(data.revenue?._sum?.total_amount ?? 0),
            expenses: Number(data.expenses?._sum?.total_amount ?? 0),
            net_profit: Number(data.revenue?._sum?.total_amount ?? 0) - Number(data.expenses?._sum?.total_amount ?? 0),
            recent_receipts: data.recent_receipts ?? []
        };
    } catch (error) {
        console.error(error);
    }
};

export const getCashFlowData = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Sending logout request to our backend API route.
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/cashflow`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        // If response is not ok, return error message from server or a default one.
       if (!response.ok) {
            const data = await response.json();
            return { error: data.error || "Invalid or expired session token" };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

// export const getSubscriptionData = async () => {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get("token")?.value;

//         const response = await fetch("http://localhost:5001/api/subscription/status", {
//             method: 'GET',
//             headers: {
//                 'Cookie': `token=${token}`
//             }
//         });

//         // If response is not ok, return error message from server or a default one.
//         if(!response.ok) {
//             const data = await response.json();
//             return { error: data.error || "Invalid or expired session token" };
//         }

//         const data = await response.json();
//         return data;
//     } catch(error) {
//         console.error(error);
//     }
// };