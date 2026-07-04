import Receipt from "./components/Receipt";
import { authenticateUser } from "@/lib/auth";
import Header from "./components/Header";

export default async function Page() {
    await authenticateUser();
    return (
        <div>
            <Receipt header={<Header />} />
        </div>
    );
};