import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const authToken = req.cookies.get("vero_auth_token")?.value;
    const body = await req.json(); // { BusinessId, FilingPeriod }

    const response = await fetch("https://api-sandbox.vero.fi/Return/SAT/GetFiledVATReturn/v2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.VERO_SANDBOX_KEY!,
            "Vero-SoftwareKey": "test",
            "User-Agent": "AI-Bookkeeper/1.0 (Node.js)",
            "Accept": "*/*",
            ...(authToken && { "Vero-AuthorizationToken": authToken }),
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}