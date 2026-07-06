import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSubscription } from "@/lib/checkSubscription";

export async function GET(req: NextRequest) {
    await checkSubscription();
    const cookieStore = await cookies();
    const authToken = cookieStore.get("vero_auth_token")?.value;
    const businessId = req.nextUrl.searchParams.get("businessId");

    const response = await fetch("https://api-sandbox.vero.fi/Return/SAT/GetVATPeriods/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.VERO_SANDBOX_KEY!,
            "Vero-SoftwareKey": "test",
            "User-Agent": "AI-Bookkeeper/1.0 (Node.js)",
            "Accept": "*/*",
            ...(authToken && { "Vero-AuthorizationToken": authToken }),
        },
        body: JSON.stringify({
            BusinessId: businessId,
            FilingYear: new Date().getFullYear(),
        }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
};