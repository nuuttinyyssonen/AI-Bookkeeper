import { getReceipts } from "./action";
import { ReceiptData } from "./components/receiptData";
import { authenticateUser } from "@/lib/auth";

export default async function ReceiptsPage() {
    await authenticateUser();
    const initialData = await getReceipts({ page: 1, limit: 20, type: "EXPENSE" });
    return (
        <div className="px-6 py-8">
            <ReceiptData initialData={initialData} />
        </div>
    );
}