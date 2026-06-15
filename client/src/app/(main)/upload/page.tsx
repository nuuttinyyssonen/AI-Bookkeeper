import UploadOverview from "./components/UploadOverview";
import Header from "./components/Header";
import { authenticateUser } from "@/lib/auth";

export default async function Page() {
    await authenticateUser();

    return (
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Header />
            <section className="max-w-xl">
                <UploadOverview />
            </section>
        </div>
    )
}
