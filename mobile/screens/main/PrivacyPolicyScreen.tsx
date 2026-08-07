import { View, Text, ScrollView, Linking } from "react-native";
import LegalHeader from "../../components/Legal/LegalHeader";
import DraftBanner from "../../components/Legal/DraftBanner";
import LegalSection from "../../components/Legal/LegalSection";
import LegalList from "../../components/Legal/LegalList";
import LegalTable from "../../components/Legal/LegalTable";
import Callout from "../../components/Legal/Callout";
import FillMe from "../../components/Legal/FillMe";

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView className="flex-1 bg-slate-50">
            <LegalHeader
                eyebrow="GDPR 2016/679 · artiklat 13 & 14"
                title="Tietosuojaseloste"
                description="Kuvaus siitä, miten AI-Bookkeeper käsittelee kuiteista ja tositteista poimittavia henkilötietoja."
                meta={
                    <View className="mt-3 self-start rounded-full border border-dashed border-amber-400 bg-white px-3 py-1">
                        <Text className="text-xs font-medium text-amber-700">
                            Päivitetty: <FillMe>PVM</FillMe>
                        </Text>
                    </View>
                }
            />

            <View className="gap-0 px-4 py-6">
                <DraftBanner>
                    Tämä sivu sisältää AI-Bookkeeperin käyttöehdot. Sisältö tulee vielä tarkistuttaa juristilla ennen virallista julkaisua.
                </DraftBanner>

                <LegalSection num="01" title="Rekisterinpitäjä">
                    <Text className="text-sm leading-6 text-slate-600">AI-Bookkeeper</Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Y-tunnus: <FillMe>1234567-8</FillMe>
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Osoite: <FillMe>osoite</FillMe>
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">Sähköposti: nuutti.nyyssonen@gmail.com</Text>
                    <Text className="text-sm leading-6 text-slate-600">Puhelin: 040 123 4567</Text>
                </LegalSection>

                <LegalSection num="02" title="Yhteyshenkilö tietosuoja-asioissa">
                    <Text className="text-sm leading-6 text-slate-600">AI-Bookkeeper</Text>
                    <Text className="text-sm leading-6 text-slate-600">Sähköposti: nuutti.nyyssonen@gmail.com</Text>
                </LegalSection>

                <LegalSection num="03" title="Käsiteltävät henkilötiedot">
                    <Text className="text-sm leading-6 text-slate-600">
                        Sovellus käsittelee kirjanpidon kuiteista ja tositteista poimittavia tietoja, kuten:
                    </Text>
                    <LegalList
                        items={[
                            "Myyjän/liikkeen nimi, osoite ja yhteystiedot",
                            "Ostotapahtuman päivämäärä, summa ja tuote-/palvelurivit",
                            "Kuitissa mahdollisesti näkyvä myyjän edustajan tai kassahenkilön nimi",
                            "Kuitin kuva/skannaus sellaisenaan",
                            "Mahdolliset asiakastiedot (esim. laskutettavan asiakkaan nimi ja yhteystiedot B2B-tositteissa)",
                        ]}
                    />
                </LegalSection>

                <LegalSection num="04" title="Käsittelyn tarkoitus ja oikeusperuste">
                    <Text className="text-sm leading-6 text-slate-600">Henkilötietoja käsitellään seuraaviin tarkoituksiin:</Text>
                    <LegalTable
                        headers={["Tarkoitus", "Oikeusperuste"]}
                        rows={[
                            [
                                "Kirjanpitolain mukaisen kirjanpitovelvoitteen täyttäminen",
                                "GDPR 6(1)(c) — lakisääteinen velvoite",
                            ],
                            [
                                "Tulojen ja menojen seuranta ja liiketoiminnan hallinta",
                                "GDPR 6(1)(b) — sopimuksen täytäntöönpano",
                            ],
                        ]}
                    />
                    <Text className="text-sm leading-6 text-slate-600">
                        Tietoja ei käytetä automaattiseen päätöksentekoon tai profilointiin, joka vaikuttaisi rekisteröityyn oikeudellisesti tai merkittävästi.
                    </Text>
                </LegalSection>

                <LegalSection num="05" title="Automaattinen käsittely: OCR ja tekoäly (LLM)">
                    <Text className="text-sm leading-6 text-slate-600">
                        Kuiteista poimitaan tietoja automaattisesti optisen tekstintunnistuksen (OCR) ja kielimallipohjaisen (LLM) teknologian avulla. Tämä käsittely:
                    </Text>
                    <LegalList
                        items={[
                            "Perustuu OpenAI API -palveluun",
                            "Tapahtuu globaalisti",
                            "Ei sisällä profilointia, joka vaikuttaisi rekisteröidyn oikeuksiin",
                            "Dataa ei käytetä tekoälymallin jatkokouluttamiseen",
                        ]}
                    />
                </LegalSection>

                <LegalSection num="06" title="Tietojen vastaanottajat ja käsittelijät">
                    <Text className="text-sm leading-6 text-slate-600">
                        Tietoja voidaan siirtää seuraaville käsittelijöille tietojenkäsittelysopimuksen (GDPR art. 28) nojalla:
                    </Text>
                    <LegalTable
                        headers={["Palveluntarjoaja", "Käsittelyn tarkoitus", "Sijainti"]}
                        rows={[
                            [<FillMe key="p1">OCR-palvelu / Google Vision API</FillMe>, "Kuittien tekstintunnistus", "Yhdysvallat, globaali"],
                            [<FillMe key="p2">LLM-toimittaja, OpenAI</FillMe>, "Tietojen jäsentely ja luokittelu", "Yhdysvallat, globaali"],
                        ]}
                    />
                </LegalSection>

                <LegalSection num="07" title="Tietojen siirto EU/ETA-alueen ulkopuolelle">
                    <Text className="text-sm leading-6 text-slate-600">
                        Osa henkilötietojen käsittelystä tapahtuu EU/ETA-alueen ulkopuolella, koska käytämme kuittien automaattiseen tulkintaan OpenAI:n tarjoamaa tekoälypalvelua (OpenAI OpCo, LLC / OpenAI Ireland Ltd.). OpenAI toimii tässä käsittelyssä henkilötietojen käsittelijänä, ja käsittelyä säätelee OpenAI:n tietojenkäsittelyä koskeva lisäosa (Data Processing Addendum), joka on osa OpenAI:n palvelusopimusta.
                    </Text>
                    <Callout label="Suojatoimi">
                        <Text className="text-sm leading-6 text-teal-900">
                            Siltä osin kuin henkilötietoja siirretään Euroopan talousalueen tai Sveitsin ulkopuolelle, siirto perustuu Euroopan komission hyväksymiin vakiosopimuslausekkeisiin (Standard Contractual Clauses, SCC), jotka varmistavat henkilötietojen suojan tason vastaavan EU:n tietosuojalainsäädännön vaatimuksia.
                        </Text>
                    </Callout>
                </LegalSection>

                <LegalSection num="08" title="Tietojen säilytysaika">
                    <Text className="text-sm leading-6 text-slate-600">
                        Kirjanpitolain (1336/1997) mukaan tositteet ja niihin liittyvät tiedot säilytetään vähintään{" "}
                        <Text className="font-semibold text-slate-950">kuusi (6) vuotta</Text>{" "}
                        sen tilikauden päättymisestä, jonka aikana tosite on syntynyt. Tämän jälkeen tiedot poistetaan tai anonymisoidaan, ellei muu lainsäädäntö edellytä pidempää säilytystä.
                    </Text>
                </LegalSection>

                <LegalSection num="09" title="Tietoturva">
                    <Text className="text-sm leading-6 text-slate-600">
                        Tietoja suojataan asianmukaisin teknisin ja organisatorisin toimenpitein, kuten:
                    </Text>
                    <LegalList items={["Tallennettujen tietojen salaus", "Käyttöoikeuksien rajaaminen"]} />
                </LegalSection>

                <LegalSection num="10" title="Rekisteröidyn oikeudet">
                    <Text className="text-sm leading-6 text-slate-600">
                        Rekisteröidyllä (esim. kuitissa mainitulla myyjän edustajalla tai asiakkaalla) on oikeus:
                    </Text>
                    <LegalList
                        items={[
                            "saada pääsy häntä koskeviin tietoihin",
                            "vaatia virheellisen tiedon korjaamista",
                            "vaatia tiedon poistamista (rajoituksin, koska kirjanpitolaki voi estää poiston säilytysaikana)",
                            "tehdä valitus valvontaviranomaiselle",
                        ]}
                    />
                    <Text className="text-sm leading-6 text-slate-600">
                        Valvontaviranomainen Suomessa: Tietosuojavaltuutetun toimisto,{" "}
                        <Text
                            className="text-teal-700 underline"
                            onPress={() => Linking.openURL("https://www.tietosuoja.fi")}
                        >
                            www.tietosuoja.fi
                        </Text>
                    </Text>
                </LegalSection>

                <LegalSection num="11" title="Yhteydenotot">
                    <Text className="text-sm leading-6 text-slate-600">
                        Rekisteröidyn oikeuksien käyttöä koskevat pyynnöt osoitetaan kohdassa 1 mainittuun rekisterinpitäjään.
                    </Text>
                </LegalSection>
            </View>
        </ScrollView>
    );
};
