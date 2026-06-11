// app/api/report/[id]/pdf/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(`http://localhost:5001/api/report/${id}/pdf`, {
        headers: { 'Cookie': `token=${token}` }
    });

    if (!response.ok) {
        return new Response("Failed to fetch PDF", { status: response.status });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=vat-report-${id}.pdf`
        }
    });
}