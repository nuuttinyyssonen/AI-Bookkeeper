import { getTranslations } from "next-intl/server";
import LegalHero from "../components/legal-hero";
import LegalToc, { TocItem } from "../components/legal-toc";
import LegalSection from "../components/legal-section";
import Callout from "../components/callout";
import FillMe from "../components/fill-me";
import DraftBanner from "../components/draft-banner";

export async function generateMetadata() {
    const t = await getTranslations("privacyPage");
    return { title: t("metaTitle") };
}

export default async function PrivacyPage() {
    const t = await getTranslations("privacyPage");
    const n = await getTranslations("termsPage");
    const toc = t.raw("toc") as TocItem[];

    const s4Rows = t.raw("s4.tableRows") as string[][];
    const s6Rows = t.raw("s6.tableRows") as { provider: string; purpose: string; location: string }[];

    return (
        <>
            <LegalHero
                eyebrow={t("eyebrow")}
                title={t("title")}
                description={t("description")}
                meta={
                    <span className="rounded-full border border-dashed border-amber-400 dark:border-amber-500 bg-white dark:bg-slate-950 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-200">
                        {t("updatedLabel")}: <FillMe>{t("updatedPlaceholder")}</FillMe>
                    </span>
                }
            />


            <div className="mx-auto max-w-5xl px-6 py-12">
                <DraftBanner>{n("draftBanner")}</DraftBanner>
                <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-14">
                    <LegalToc items={toc} />

                    <div className="max-w-2xl divide-y divide-slate-200 dark:divide-slate-700">
                        <LegalSection id="p1" num="01" title={t("s1.title")}>
                            <p>
                                AI-Bookkeeper<br />
                                {t("s1.orgIdLabel")}: <FillMe>{t("s1.orgIdPlaceholder")}</FillMe><br />
                                {t("s1.addressLabel")}: <FillMe>{t("s1.addressPlaceholder")}</FillMe><br />
                                {t("s1.emailLabel")}: nuutti.nyyssonen@gmail.com<br />
                                {t("s1.phoneLabel")}: {t("s1.phoneValue")}
                            </p>
                        </LegalSection>

                        <LegalSection id="p2" num="02" title={t("s2.title")}>
                            <p>
                                AI-Bookkeeper<br />
                                {t("s2.emailLabel")}: nuutti.nyyssonen@gmail.com
                            </p>
                        </LegalSection>

                        <LegalSection id="p3" num="03" title={t("s3.title")}>
                            <p>{t("s3.intro")}</p>
                            <ul className="space-y-2">
                                {(t.raw("s3.items") as string[]).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            {/* <p>
                                {t("s3.excludeIntro")}{" "}
                                <FillMe>{t("s3.excludeFillMe")}</FillMe>
                            </p> */}
                        </LegalSection>

                        <LegalSection id="p4" num="04" title={t("s4.title")}>
                            <p>{t("s4.intro")}</p>
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <tr>
                                            {(t.raw("s4.tableHeaders") as string[]).map((header) => (
                                                <th key={header} className="px-4 py-3">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {s4Rows.map((row) => (
                                            <tr key={row[0]}>
                                                {row.map((cell, i) => (
                                                    <td key={i} className="px-4 py-3">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p>{t("s4.outro")}</p>
                        </LegalSection>

                        <LegalSection id="p5" num="05" title={t("s5.title")}>
                            <p>{t("s5.intro")}</p>
                            <ul className="space-y-2">
                                {(t.raw("s5.items") as string[]).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </LegalSection>

                        <LegalSection id="p6" num="06" title={t("s6.title")}>
                            <p>{t("s6.intro")}</p>
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <tr>
                                            {(t.raw("s6.tableHeaders") as string[]).map((header) => (
                                                <th key={header} className="px-4 py-3">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {s6Rows.map((row) => (
                                            <tr key={row.provider}>
                                                <td className="px-4 py-3"><FillMe>{row.provider}</FillMe></td>
                                                <td className="px-4 py-3">{row.purpose}</td>
                                                <td className="px-4 py-3">{row.location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </LegalSection>

                        <LegalSection id="p7" num="07" title={t("s7.title")}>
                            <p>{t("s7.text")}</p>
                            <Callout label={t("s7.calloutLabel")}>
                                <p>{t("s7.calloutText")}</p>
                            </Callout>
                        </LegalSection>

                        <LegalSection id="p8" num="08" title={t("s8.title")}>
                            <p>
                                {t("s8.textBefore")}<strong>{t("s8.bold")}</strong>{t("s8.textAfter")}
                            </p>
                        </LegalSection>

                        <LegalSection id="p9" num="09" title={t("s9.title")}>
                            <p>{t("s9.intro")}</p>
                            <ul className="space-y-2">
                                {(t.raw("s9.items") as string[]).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                                {/* <li><FillMe>{t("s9.fillMeItem")}</FillMe></li> */}
                            </ul>
                        </LegalSection>

                        <LegalSection id="p10" num="10" title={t("s10.title")}>
                            <p>{t("s10.intro")}</p>
                            <ul className="space-y-2">
                                {(t.raw("s10.items") as string[]).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <p>
                                {t("s10.linkIntro")}
                                <a href="https://www.tietosuoja.fi">www.tietosuoja.fi</a>
                            </p>
                        </LegalSection>

                        <LegalSection id="p11" num="11" title={t("s11.title")}>
                            <p>{t("s11.text")}</p>
                        </LegalSection>
                    </div>
                </div>
            </div>
        </>
    );
}
