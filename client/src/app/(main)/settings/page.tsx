import { authenticateUser } from "@/lib/auth";
import { getUserData } from "./action";

import Infromation from "./components/Information";
import Header from "./components/Header";
import Transactions from "./components/Transactions";
import Subscription from "./components/Subscription";
import Footer from "./components/Footer";

export default async function Page() {
    await authenticateUser();
    const { user, subscription, history } = await getUserData();
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Header />
                <Infromation user={user}/>
                <Subscription subscription={subscription}/>
                <Transactions history={history} />
                <Footer />
            </div>
        </main>
    );
}