import ChatProvider from "./components/ChatProvider";
import { authenticateUser } from "@/lib/auth";

export default async function Page() {
    await authenticateUser();
    return (
        <div>
            <ChatProvider />
        </div>
    );
}