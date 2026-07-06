import { NextRequest, NextResponse } from "next/server";
import { checkSubscription } from "@/lib/checkSubscription";

export async function POST(req: NextRequest) {
    await checkSubscription();
    const authToken = req.cookies.get("vero_auth_token")?.value;
    const token = req.cookies.get("token")?.value;
    const { reportId, ...veroBody } = await req.json();

    const response = await fetch("https://api-sandbox.vero.fi/Return/SAT/FileVATReturn/v2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.VERO_SANDBOX_KEY!,
            "Vero-SoftwareKey": "test",
            "User-Agent": "AI-Bookkeeper/1.0 (Node.js)",
            "Accept": "*/*",
            ...(authToken && { "Vero-AuthorizationToken": authToken }),
        },
        body: JSON.stringify(veroBody),
    });

    const data = await response.json();

    if (response.ok && data.UniqueIdentifier && reportId) {
        await fetch(`http://localhost:5001/api/report/${reportId}/declaration-sent`, {
            method: "PUT",
            headers: { Cookie: `token=${token}` },
        });
    }

    return NextResponse.json(data, { status: response.status });
}