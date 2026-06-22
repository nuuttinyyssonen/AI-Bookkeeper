import ChatProvider from "./components/ChatProvider";
import { authenticateUser } from "@/lib/auth";

export default async function ChatPage() {
    await authenticateUser();
    return (
        <ChatProvider />
    );
}