// app/vat-return/authorize/route.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkSubscription } from "@/lib/checkSubscription";

export async function GET() {
    const hasSubscription = await checkSubscription();
    if (!hasSubscription) redirect("/pricing?message=subscription_required");

    const response = await fetch("https://api-sandbox.vero.fi/General/Authorization/GetToken/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.VERO_SANDBOX_KEY!,
            "Vero-SoftwareKey": "test",
            "User-Agent": "AI-Bookkeeper/1.0 (Node.js)",
            "Accept": "*/*",
        },
        body: JSON.stringify({
            DelegateIdentifier: "9999999-2",
            PrincipalIdentifiers: ["9999998-4"],
        }),
    });

    const data = await response.json();

    const token = data.Authorizations?.[0]?.AuthorizationToken;

    const cookieStore = await cookies();
    cookieStore.set("vero_auth_token", token, { httpOnly: true });
    
    const expiresAt = new Date(Date.now() + 480 * 60 * 1000).toISOString(); // 480 min from now
    cookieStore.set("vero_auth_expires", expiresAt, { httpOnly: true });

    redirect("/vat-return");
}