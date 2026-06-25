import PricingProvider from "./components/PricingProvider";
import { authenticateUser } from "@/lib/auth";
import { getSubscriptionData } from "../dashboard/action";

export default async function Page() {
    await authenticateUser();
    const { subscription } = await getSubscriptionData();
    return (
        <PricingProvider subscription={subscription}/>
    );
};