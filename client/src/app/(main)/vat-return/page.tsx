import { authenticateUser, getVeroAuthToken } from "@/lib/auth";

export default async function VatReturnPage() {
    await authenticateUser();
    const veroToken = await getVeroAuthToken();

    console.log(veroToken)

    if (!veroToken) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Vero authentication required</h2>
                    <p className="text-sm text-slate-600 mb-4">You need to authorize with Vero before filing a VAT return.</p>
                    <a href="/api/vero/authorize">
                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-semibold">
                            Authorize with Vero
                        </button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50" />
    );
}
