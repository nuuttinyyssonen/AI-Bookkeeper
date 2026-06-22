import ChatProvider from "./components/ChatProvider";
import { authenticateUser } from "@/lib/auth";

export default async function AssistantPage() {
    await authenticateUser();
    return (
        <ChatProvider />
    );
}