import { authenticateUser } from "@/lib/auth";
import ChatLayout from "./components/ChatLayout";

export default async function ChatPage() {
    // await authenticateUser();
    return (
        <ChatLayout />
    );
}