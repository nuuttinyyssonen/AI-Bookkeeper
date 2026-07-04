import Header from "../../components/Header"
import ChatProvider from "./ChatProvider"

export default function ChatLayout() {
  return (
    <ChatProvider header={<Header />} />
  )
}