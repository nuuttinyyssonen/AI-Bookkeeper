import Receipt from "./components/Receipt";
import { authenticateUser } from "@/lib/auth";

export default async function Page() {
    await authenticateUser();
    return (
        <div>
            <Receipt />
        </div>
    );
};