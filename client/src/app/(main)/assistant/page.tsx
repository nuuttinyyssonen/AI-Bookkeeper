import { getUserData } from "../settings/action";
import ChatProvider from "./components/ChatProvider";
import { authenticateUser } from "@/lib/auth";

export default async function AssistantPage() {
    await authenticateUser();
    const { user } = await getUserData();
    const userName = user.first_name;
    return (
        <ChatProvider userName={userName} />
    );
}