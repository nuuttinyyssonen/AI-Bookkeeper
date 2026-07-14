import LegalHero from "../components/legal-hero";
import LegalToc, { TocItem } from "../components/legal-toc";
import LegalSection from "../components/legal-section";
import Callout from "../components/callout";
import FillMe from "../components/fill-me";

const toc: TocItem[] = [
    { id: "p1", num: "01", label: "Rekisterinpitäjä" },
    { id: "p2", num: "02", label: "Yhteyshenkilö" },
    { id: "p3", num: "03", label: "Käsiteltävät tiedot" },
    { id: "p4", num: "04", label: "Tarkoitus ja peruste" },
    { id: "p5", num: "05", label: "OCR ja tekoäly" },
    { id: "p6", num: "06", label: "Vastaanottajat" },
    { id: "p7", num: "07", label: "Siirto EU/ETA:n ulkop." },
    { id: "p8", num: "08", label: "Säilytysaika" },
    { id: "p9", num: "09", label: "Tietoturva" },
    { id: "p10", num: "10", label: "Rekisteröidyn oikeudet" },
    { id: "p11", num: "11", label: "Yhteydenotot" },
];

export const metadata = { title: "Tietosuojaseloste — AI Bookkeeper" };

export default function PrivacyPage() {
    return (
        <>
            <LegalHero
                eyebrow="GDPR 2016/679 · artiklat 13 & 14"
                title="Tietosuojaseloste"
                description="Kuvaus siitä, miten AI-Bookkeeper käsittelee kuiteista ja tositteista poimittavia henkilötietoja."
                meta={
                    <span className="rounded-full border border-dashed border-amber-400 bg-white px-3 py-1 text-xs font-medium text-amber-700">
                        Päivitetty: <FillMe>PVM</FillMe>
                    </span>
                }
            />

            <div className="mx-auto max-w-5xl px-6 py-12">
                <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-14">
                    <LegalToc items={toc} />

                    <div className="max-w-2xl divide-y divide-slate-200">
                        <LegalSection id="p1" num="01" title="Rekisterinpitäjä">
                            <p>
                                AI-Bookkeeper<br />
                                Y-tunnus: <FillMe>1234567-8</FillMe><br />
                                Osoite: <FillMe>osoite</FillMe><br />
                                Sähköposti: nuutti.nyyssonen@gmail.com<br />
                                Puhelin: 040 123 4567
                            </p>
                        </LegalSection>

                        <LegalSection id="p2" num="02" title="Yhteyshenkilö tietosuoja-asioissa">
                            <p>
                                AI-Bookkeeper<br />
                                Sähköposti: nuutti.nyyssonen@gmail.com
                            </p>
                        </LegalSection>

                        <LegalSection id="p3" num="03" title="Käsiteltävät henkilötiedot">
                            <p>Sovellus käsittelee kirjanpidon kuiteista ja tositteista poimittavia tietoja, kuten:</p>
                            <ul className="space-y-2">
                                <li>Myyjän/liikkeen nimi, osoite ja yhteystiedot</li>
                                <li>Ostotapahtuman päivämäärä, summa ja tuote-/palvelurivit</li>
                                <li>Kuitissa mahdollisesti näkyvä myyjän edustajan tai kassahenkilön nimi</li>
                                <li>Kuitin kuva/skannaus sellaisenaan</li>
                                <li>Mahdolliset asiakastiedot (esim. laskutettavan asiakkaan nimi ja yhteystiedot B2B-tositteissa)</li>
                            </ul>
                            <p>
                                Emme käsittele:{" "}
                                <FillMe>
                                    esim. terveystietoja, erityisiä henkilötietoryhmiä — tarkenna, jos kuiteissa voi
                                    esiintyä esim. apteekki- tai terveyspalvelutositteita, ja miten näitä käsitellään
                                </FillMe>
                            </p>
                        </LegalSection>

                        <LegalSection id="p4" num="04" title="Käsittelyn tarkoitus ja oikeusperuste">
                            <p>Henkilötietoja käsitellään seuraaviin tarkoituksiin:</p>
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Tarkoitus</th>
                                            <th className="px-4 py-3">Oikeusperuste</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="px-4 py-3">Kirjanpitolain mukaisen kirjanpitovelvoitteen täyttäminen</td>
                                            <td className="px-4 py-3">GDPR 6(1)(c) — lakisääteinen velvoite</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Tulojen ja menojen seuranta ja liiketoiminnan hallinta</td>
                                            <td className="px-4 py-3">GDPR 6(1)(b) — sopimuksen täytäntöönpano</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>
                                Tietoja ei käytetä automaattiseen päätöksentekoon tai profilointiin, joka vaikuttaisi
                                rekisteröityyn oikeudellisesti tai merkittävästi.
                            </p>
                        </LegalSection>

                        <LegalSection id="p5" num="05" title="Automaattinen käsittely: OCR ja tekoäly (LLM)">
                            <p>
                                Kuiteista poimitaan tietoja automaattisesti optisen tekstintunnistuksen (OCR) ja
                                kielimallipohjaisen (LLM) teknologian avulla. Tämä käsittely:
                            </p>
                            <ul className="space-y-2">
                                <li>Perustuu OpenAI API -palveluun</li>
                                <li>Tapahtuu globaalisti</li>
                                <li>Ei sisällä profilointia, joka vaikuttaisi rekisteröidyn oikeuksiin</li>
                                <li>Dataa ei käytetä tekoälymallin jatkokouluttamiseen</li>
                            </ul>
                        </LegalSection>

                        <LegalSection id="p6" num="06" title="Tietojen vastaanottajat ja käsittelijät">
                            <p>
                                Tietoja voidaan siirtää seuraaville käsittelijöille tietojenkäsittelysopimuksen
                                (GDPR art. 28) nojalla:
                            </p>
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Palveluntarjoaja</th>
                                            <th className="px-4 py-3">Käsittelyn tarkoitus</th>
                                            <th className="px-4 py-3">Sijainti</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="px-4 py-3"><FillMe>OCR-palvelu / Google Vision API</FillMe></td>
                                            <td className="px-4 py-3">Kuittien tekstintunnistus</td>
                                            <td className="px-4 py-3">Yhdysvallat, globaali</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3"><FillMe>LLM-toimittaja, OpenAI</FillMe></td>
                                            <td className="px-4 py-3">Tietojen jäsentely ja luokittelu</td>
                                            <td className="px-4 py-3">Yhdysvallat, globaali</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </LegalSection>

                        <LegalSection id="p7" num="07" title="Tietojen siirto EU/ETA-alueen ulkopuolelle">
                            <p>
                                Osa henkilötietojen käsittelystä tapahtuu EU/ETA-alueen ulkopuolella, koska käytämme
                                kuittien automaattiseen tulkintaan OpenAI:n tarjoamaa tekoälypalvelua (OpenAI OpCo,
                                LLC / OpenAI Ireland Ltd.). OpenAI toimii tässä käsittelyssä henkilötietojen
                                käsittelijänä, ja käsittelyä säätelee OpenAI:n tietojenkäsittelyä koskeva lisäosa
                                (Data Processing Addendum), joka on osa OpenAI:n palvelusopimusta.
                            </p>
                            <Callout label="Suojatoimi">
                                <p>
                                    Siltä osin kuin henkilötietoja siirretään Euroopan talousalueen tai Sveitsin
                                    ulkopuolelle, siirto perustuu Euroopan komission hyväksymiin
                                    vakiosopimuslausekkeisiin (Standard Contractual Clauses, SCC), jotka varmistavat
                                    henkilötietojen suojan tason vastaavan EU:n tietosuojalainsäädännön vaatimuksia.
                                </p>
                            </Callout>
                        </LegalSection>

                        <LegalSection id="p8" num="08" title="Tietojen säilytysaika">
                            <p>
                                Kirjanpitolain (1336/1997) mukaan tositteet ja niihin liittyvät tiedot säilytetään
                                vähintään <strong>kuusi (6) vuotta</strong> sen tilikauden päättymisestä, jonka
                                aikana tosite on syntynyt. Tämän jälkeen tiedot poistetaan tai anonymisoidaan, ellei
                                muu lainsäädäntö edellytä pidempää säilytystä.
                            </p>
                        </LegalSection>

                        <LegalSection id="p9" num="09" title="Tietoturva">
                            <p>Tietoja suojataan asianmukaisin teknisin ja organisatorisin toimenpitein, kuten:</p>
                            <ul className="space-y-2">
                                <li>Tallennettujen tietojen salaus</li>
                                <li>Käyttöoikeuksien rajaaminen</li>
                                <li><FillMe>Muut toimenpiteet: varmuuskopiointi, pääsylokit jne.</FillMe></li>
                            </ul>
                        </LegalSection>

                        <LegalSection id="p10" num="10" title="Rekisteröidyn oikeudet">
                            <p>Rekisteröidyllä (esim. kuitissa mainitulla myyjän edustajalla tai asiakkaalla) on oikeus:</p>
                            <ul className="space-y-2">
                                <li>saada pääsy häntä koskeviin tietoihin</li>
                                <li>vaatia virheellisen tiedon korjaamista</li>
                                <li>vaatia tiedon poistamista (rajoituksin, koska kirjanpitolaki voi estää poiston säilytysaikana)</li>
                                <li>tehdä valitus valvontaviranomaiselle</li>
                            </ul>
                            <p>
                                Valvontaviranomainen Suomessa: Tietosuojavaltuutetun toimisto,{" "}
                                <a href="https://www.tietosuoja.fi">www.tietosuoja.fi</a>
                            </p>
                        </LegalSection>

                        <LegalSection id="p11" num="11" title="Yhteydenotot">
                            <p>Rekisteröidyn oikeuksien käyttöä koskevat pyynnöt osoitetaan kohdassa 1 mainittuun rekisterinpitäjään.</p>
                        </LegalSection>
                    </div>
                </div>
            </div>
        </>
    );
}
