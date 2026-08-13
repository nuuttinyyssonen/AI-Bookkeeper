import { getTranslations } from "next-intl/server";
import Link from "next/link";
import LegalHero from "../components/legal-hero";
import LegalToc, { TocItem } from "../components/legal-toc";
import LegalSection from "../components/legal-section";
import DraftBanner from "../components/draft-banner";

type ContentBlock = { p: string } | { list: string[] };
type Section = { id: string; num: string; title: string; content: ContentBlock[] };

function SectionBlocks({ content }: { content: ContentBlock[] }) {
    return (
        <>
            {content.map((block, i) =>
                "list" in block ? (
                    <ul key={i} className="space-y-2">
                        {block.list.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p key={i}>{block.p}</p>
                )
            )}
        </>
    );
}

export async function generateMetadata() {
    const t = await getTranslations("termsPage");
    return { title: t("metaTitle") };
}

export default async function TermsPage() {
    const t = await getTranslations("termsPage");
    const toc = t.raw("toc") as TocItem[];
    const sections = t.raw("sections") as Section[];
    const dataProtectionTitle = t("dataProtection.title");
    const dataProtectionText = t.raw("dataProtection.text") as string;
    const dataProtectionLinkText = t("dataProtection.linkText");
    const [beforeLink, afterLink] = dataProtectionText.split("{link}");

    return (
        <>
            <LegalHero
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("description")}
            />

            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-14">
                    <LegalToc items={toc} />

                    <div className="max-w-2xl">
                        <DraftBanner>{t("draftBanner")}</DraftBanner>

                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {sections.slice(0, 7).map((section) => (
                                <LegalSection key={section.id} id={section.id} num={section.num} title={section.title}>
                                    <SectionBlocks content={section.content} />
                                </LegalSection>
                            ))}

                            <LegalSection id="t8" num="08" title={dataProtectionTitle}>
                                <p>
                                    {beforeLink}
                                    <Link href="/privacy">{dataProtectionLinkText}</Link>
                                    {afterLink}
                                </p>
                            </LegalSection>

                            {sections.slice(7).map((section) => (
                                <LegalSection key={section.id} id={section.id} num={section.num} title={section.title}>
                                    <SectionBlocks content={section.content} />
                                </LegalSection>
                            ))}

                            <LegalSection id="t12" num="12" title={t("contact.title")}>
                                <p>
                                    AI-Bookkeeper<br />
                                    {t("contact.email")}: nuutti.nyyssonen@gmail.com
                                </p>
                            </LegalSection>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
