import { getTranslations } from "next-intl/server";
import DemoBlocked from "@/components/DemoBlocked";

export default async function Page() {
    const t = await getTranslations('demo');
    return <DemoBlocked message={t('authBlocked')} />;
};
