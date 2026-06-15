import { getReceipts } from "./action";
import { ReceiptData } from "./components/receiptData";
import { authenticateUser } from "@/lib/auth";

export default async function ReceiptsPage() {
    await authenticateUser();
    const { receipts, is_documents_processing, is_documents_pending } = await getReceipts();
    return (
        <div className="px-6 py-8">
            <ReceiptData 
                receiptList={receipts} 
                is_documents_processing={is_documents_processing} 
                is_documents_pending={is_documents_pending}
                fetchReceipts={getReceipts}
            />
        </div>
    );
}

