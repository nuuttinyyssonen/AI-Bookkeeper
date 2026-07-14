import LegalHero from "../components/legal-hero";
import LegalToc, { TocItem } from "../components/legal-toc";
import LegalSection from "../components/legal-section";
import DraftBanner from "../components/draft-banner";

const toc: TocItem[] = [
    { id: "t1", num: "01", label: "Osapuolet" },
    { id: "t2", num: "02", label: "Palvelun kuvaus" },
    { id: "t3", num: "03", label: "Käyttäjätili" },
    { id: "t4", num: "04", label: "Käyttäjän vastuut" },
    { id: "t5", num: "05", label: "Hinnoittelu" },
    { id: "t6", num: "06", label: "Immateriaalioikeudet" },
    { id: "t7", num: "07", label: "Vastuunrajoitus" },
    { id: "t8", num: "08", label: "Tietosuoja" },
    { id: "t9", num: "09", label: "Kesto ja irtisanominen" },
    { id: "t10", num: "10", label: "Sovellettava laki" },
    { id: "t11", num: "11", label: "Muutokset ehtoihin" },
    { id: "t12", num: "12", label: "Yhteystiedot" },
];

export const metadata = { title: "Käyttöehdot — AI Bookkeeper" };

export default function TermsPage() {
    return (
        <>
            <LegalHero
                eyebrow="Luonnos"
                title="Käyttöehdot"
                description="AI-Bookkeeper-kirjanpitosovelluksen käyttöä koskevat ehdot."
            />

            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-14">
                    <LegalToc items={toc} />

                    <div className="max-w-2xl">
                        <DraftBanner>
                            Tämä sivu on rakenteellinen pohja käyttöehdoille — kohdat on lueteltu tyypillisen
                            kirjanpito-SaaS-palvelun mukaan, mutta sisältö on täytettävä ja tarkistutettava
                            juristilla ennen julkaisua.
                        </DraftBanner>

                        <div className="divide-y divide-slate-200">
                            <LegalSection id="t1" num="01" title="Osapuolet ja soveltamisala">
                                <p className="italic text-slate-400">
                                    Määrittele sopimuksen osapuolet (AI-Bookkeeper ja käyttäjä/yritysasiakas) sekä
                                    se, mihin palveluihin ja käyttäjäryhmiin ehdot soveltuvat.
                                </p>
                            </LegalSection>

                            <LegalSection id="t2" num="02" title="Palvelun kuvaus">
                                <p className="italic text-slate-400">
                                    Kuvaa lyhyesti mitä AI-Bookkeeper tekee: kuittien ja tositteiden automaattinen
                                    tulkinta OCR:n ja tekoälyn avulla, kirjanpitoaineiston koostaminen ja
                                    raportointi.
                                </p>
                            </LegalSection>

                            <LegalSection id="t3" num="03" title="Käyttäjätili ja rekisteröityminen">
                                <p className="italic text-slate-400">
                                    Kerro tilin luomisen edellytykset, käyttäjän vastuu tunnusten säilyttämisestä
                                    ja mahdolliset rajaukset (esim. vain yritys- tai elinkeinonharjoittajakäyttöön).
                                </p>
                            </LegalSection>

                            <LegalSection id="t4" num="04" title="Käyttäjän vastuut ja kielletty käyttö">
                                <p className="italic text-slate-400">
                                    Listaa mitä käyttäjä ei saa tehdä (esim. väärien tositteiden syöttäminen,
                                    palvelun väärinkäyttö, tunnusten luvaton jakaminen) ja käyttäjän vastuu
                                    syöttämänsä aineiston oikeellisuudesta.
                                </p>
                            </LegalSection>

                            <LegalSection id="t5" num="05" title="Hinnoittelu ja maksuehdot">
                                <p className="italic text-slate-400">
                                    Kuvaa hinnoittelumalli (esim. kuukausitilaus), laskutusjakso, maksutavat sekä
                                    toimenpiteet maksun viivästyessä.
                                </p>
                            </LegalSection>

                            <LegalSection id="t6" num="06" title="Immateriaalioikeudet">
                                <p className="italic text-slate-400">
                                    Määrittele kenelle kuuluu oikeus palvelun ohjelmistoon ja kenelle käyttäjän
                                    lataamaan aineistoon (kuitit, tositteet, tuotettu kirjanpitoaineisto).
                                </p>
                            </LegalSection>

                            <LegalSection id="t7" num="07" title="Palvelun saatavuus ja vastuunrajoitus">
                                <p className="italic text-slate-400">
                                    Kuvaa palvelutason odotukset (ei SLA-takuuta / mahdollinen SLA),
                                    vastuunrajoitus OCR/tekoälytulkinnan virheistä ja käyttäjän velvollisuus
                                    tarkistaa kirjanpitoaineisto ennen viranomaiskäyttöä.
                                </p>
                            </LegalSection>

                            <LegalSection id="t8" num="08" title="Tietosuoja ja tietoturva">
                                <p>
                                    Henkilötietojen käsittelyä kuvataan tarkemmin{" "}
                                    <a href="/privacy">tietosuojaselosteessa</a>, joka on osa näitä ehtoja.
                                </p>
                            </LegalSection>

                            <LegalSection id="t9" num="09" title="Sopimuksen kesto ja irtisanominen">
                                <p className="italic text-slate-400">
                                    Kerro sopimuksen voimassaolo, irtisanomisaika sekä perusteet, joilla
                                    AI-Bookkeeper voi keskeyttää tai päättää käyttöoikeuden.
                                </p>
                            </LegalSection>

                            <LegalSection id="t10" num="10" title="Sovellettava laki ja riidanratkaisu">
                                <p className="italic text-slate-400">
                                    Määrittele sovellettava laki (todennäköisesti Suomen laki) ja
                                    riidanratkaisupaikka tai -menettely.
                                </p>
                            </LegalSection>

                            <LegalSection id="t11" num="11" title="Muutokset käyttöehtoihin">
                                <p className="italic text-slate-400">
                                    Kuvaa miten ja kuinka pian muutoksista ilmoitetaan käyttäjille ja miten
                                    muutokset tulevat voimaan.
                                </p>
                            </LegalSection>

                            <LegalSection id="t12" num="12" title="Yhteystiedot">
                                <p>
                                    AI-Bookkeeper<br />
                                    Sähköposti: nuutti.nyyssonen@gmail.com
                                </p>
                            </LegalSection>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
