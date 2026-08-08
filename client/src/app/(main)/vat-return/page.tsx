import { getTranslations } from "next-intl/server";
import DemoBlocked from "@/components/DemoBlocked";

export default async function VatReturnPage() {
    const t = await getTranslations('demo');
    return <DemoBlocked message={t('vatReturnBlocked')} />;
}
