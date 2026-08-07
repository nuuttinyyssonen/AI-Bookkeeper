import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LegalHeader from "../../components/Legal/LegalHeader";
import DraftBanner from "../../components/Legal/DraftBanner";
import LegalSection from "../../components/Legal/LegalSection";
import LegalList from "../../components/Legal/LegalList";

export default function TermsOfServiceScreen() {
    const navigation = useNavigation<any>();

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <LegalHeader
                eyebrow="Luonnos"
                title="Käyttöehdot"
                description="AI-Bookkeeper-kirjanpitosovelluksen käyttöä koskevat ehdot."
            />

            <View className="px-4 py-6">
                <DraftBanner>
                    Tämä sivu sisältää AI-Bookkeeperin käyttöehdot. Sisältö tulee vielä tarkistuttaa juristilla ennen virallista julkaisua.
                </DraftBanner>

                <LegalSection num="01" title="Osapuolet ja soveltamisala">
                    <Text className="text-sm leading-6 text-slate-600">
                        Nämä käyttöehdot muodostavat sitovan sopimuksen AI-Bookkeeper-palvelun ja sen rekisteröityneen käyttäjän välillä. Palvelua tarjoaa AI-Bookkeeper (sähköposti: nuutti.nyyssonen@gmail.com).
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Ehdot koskevat kaikkia AI-Bookkeeper-palvelun ominaisuuksia, mukaan lukien verkkosovellusta, mobiilisovellusta sekä rajapintoja. Palvelu on tarkoitettu suomalaisille yrittäjille, toiminimiyrittäjille sekä pienille yrityksille kirjanpitoaineiston hallintaan.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Rekisteröitymällä tai käyttämällä Palvelua Käyttäjä hyväksyy nämä Ehdot kokonaisuudessaan.
                    </Text>
                </LegalSection>

                <LegalSection num="02" title="Palvelun kuvaus">
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper on tekoälypohjainen kirjanpitopalvelu, joka tarjoaa seuraavat toiminnot:
                    </Text>
                    <LegalList
                        items={[
                            "Kuittien ja tositteiden automaattinen tulkinta OCR-teknologian ja tekoälyn avulla. Käyttäjä voi ladata kuvia tai PDF-tiedostoja, joista Palvelu tunnistaa automaattisesti toimittajan nimen, päivämäärän, summan ja arvonlisäveron.",
                            "Kirjanpitoaineiston koostaminen: Palvelu kokoaa tulkitun aineiston kirjanpitotiedoiksi, laskee arvonlisäverot soveltaen Suomen voimassa olevia ALV-kantoja ja muodostaa tulo- ja menoerittelyn.",
                            "Raportointi: Palvelussa voidaan tuottaa kuukausi- ja vuosiraportteja, joita voidaan viedä PDF-muodossa tai jakaa kirjanpitäjälle.",
                            "Tekoälyavustaja: Palvelun sisäinen AI-assistentti vastaa kirjanpitoon liittyviin kysymyksiin suomen tai englannin kielellä.",
                        ]}
                    />
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper ei tarjoa virallista kirjanpito- tai verokonsultointipalvelua eikä korvaa ammattitaitoisen kirjanpitäjän palveluita.
                    </Text>
                </LegalSection>

                <LegalSection num="03" title="Käyttäjätili ja rekisteröityminen">
                    <Text className="text-sm leading-6 text-slate-600">
                        Palvelun käyttö edellyttää rekisteröitymistä ja henkilökohtaisen käyttäjätilin luomista. Rekisteröityessään Käyttäjä sitoutuu antamaan totuudenmukaiset ja ajantasaiset tiedot, mukaan lukien sähköpostiosoitteen, nimen ja Y-tunnuksen.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Palvelu on tarkoitettu ensisijaisesti yritys- tai elinkeinonharjoittajakäyttöön. Käyttäjä on vastuussa käyttäjätunnustensa ja salasanansa luottamuksellisuuden säilyttämisestä. Tunnuksia ei saa luovuttaa kolmansille osapuolille.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper pidättää oikeuden hylätä rekisteröitymispyyntö tai poistaa käyttäjätili perustellusta syystä.
                    </Text>
                </LegalSection>

                <LegalSection num="04" title="Käyttäjän vastuut ja kielletty käyttö">
                    <Text className="text-sm leading-6 text-slate-600">
                        Käyttäjä vastaa siitä, että Palveluun syötetty aineisto on aitoa, laillista ja asianmukaista. Väärennettyjen tai laittomasti hankittujen tositteiden syöttäminen Palveluun on kielletty.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Käyttäjä sitoutuu olemaan käyttämättä Palvelua lainvastaisiin tarkoituksiin, haittaohjelmien levittämiseen, Palvelun kohtuuttomaan kuormittamiseen, muiden käyttäjien tietoihin tunkeutumiseen tai Palvelun kaupalliseen jälleenmyyntiin ilman kirjallista lupaa.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Käyttäjä on yksin vastuussa syöttämänsä aineiston oikeellisuudesta ja siitä, että tuotettu kirjanpitoaineisto tarkastetaan ennen sen toimittamista viranomaisille.
                    </Text>
                </LegalSection>

                <LegalSection num="05" title="Hinnoittelu ja maksuehdot">
                    <Text className="text-sm leading-6 text-slate-600">
                        Palvelua tarjotaan kuukausitilauspohjaisesti. Voimassa olevat hinnat näkyvät Palvelun hinnoittelusivulla. AI-Bookkeeper pidättää oikeuden muuttaa hintoja ilmoittamalla asiasta vähintään 30 päivää etukäteen.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Tilausmaksu veloitetaan kuukausittain etukäteen Stripe-maksunvälittäjän kautta. Uusille käyttäjille tarjotaan 14 vuorokauden maksuton kokeilujakso, jonka jälkeen tilaus jatkuu automaattisesti, ellei Käyttäjä peruuta tilaustaan.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Mikäli maksu viivästyy tai epäonnistuu, AI-Bookkeeper pidättää oikeuden rajoittaa pääsyä Palveluun. Tilauksen voi peruuttaa milloin tahansa. Maksuja ei palauteta.
                    </Text>
                </LegalSection>

                <LegalSection num="06" title="Immateriaalioikeudet">
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper omistaa kaikki oikeudet Palvelun ohjelmistoon, käyttöliittymään ja algoritmeihin. Käyttäjä säilyttää täyden omistusoikeuden kaikkeen lataamaansa aineistoon sekä Palvelun tuottamaan kirjanpitoaineistoon.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        Käyttäjä myöntää AI-Bookkeeperille rajatun käyttöoikeuden syötettyyn aineistoon ainoastaan Palvelun tuottamiseksi ja parantamiseksi. AI-Bookkeeper ei luovuta käyttäjän aineistoa kolmansille osapuolille kaupallisiin tarkoituksiin.
                    </Text>
                </LegalSection>

                <LegalSection num="07" title="Palvelun saatavuus ja vastuunrajoitus">
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper pyrkii tarjoamaan Palvelua keskeytyksettä, mutta ei takaa virheetöntä toimintaa. Palvelu tarjotaan "sellaisena kuin se on" ilman takuita.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        OCR- ja tekoälytulkinta voivat sisältää virheitä. Käyttäjä on velvollinen tarkistamaan kirjanpitoaineiston oikeellisuuden ennen sen toimittamista viranomaisille.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper ei ole vastuussa välillisistä vahingoista. Korvausvaatimukset rajoittuvat enintään Käyttäjän viimeksi kuluneiden kolmen kuukauden aikana maksamiin tilausmaksuihin.
                    </Text>
                </LegalSection>

                <LegalSection num="08" title="Tietosuoja ja tietoturva">
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper käsittelee Käyttäjän henkilötietoja{" "}
                        <Text
                            className="text-teal-700 underline"
                            onPress={() => navigation.navigate("PrivacyPolicy")}
                        >
                            tietosuojaselosteen
                        </Text>{" "}
                        mukaisesti, joka muodostaa erottamattoman osan näitä Ehtoja. AI-Bookkeeper noudattaa EU:n yleistä tietosuoja-asetusta (GDPR) sekä Suomen tietosuojalainsäädäntöä.
                    </Text>
                </LegalSection>

                <LegalSection num="09" title="Sopimuksen kesto ja irtisanominen">
                    <Text className="text-sm leading-6 text-slate-600">
                        Sopimus tulee voimaan rekisteröitymishetkellä ja on voimassa toistaiseksi. Käyttäjä voi irtisanoa sopimuksen milloin tahansa peruuttamalla tilauksensa Palvelun asetuksista.
                    </Text>
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper voi keskeyttää tai päättää Käyttäjän käyttöoikeuden välittömästi, mikäli Käyttäjä rikkoo näitä Ehtoja olennaisesti, ei suorita erääntyneitä maksuja tai vaarantaa muiden käyttäjien tietoturvan.
                    </Text>
                </LegalSection>

                <LegalSection num="10" title="Sovellettava laki ja riidanratkaisu">
                    <Text className="text-sm leading-6 text-slate-600">
                        Näihin Ehtoihin sovelletaan Suomen lakia. Ehdoista aiheutuvat riitaisuudet pyritään ratkaisemaan osapuolten välisin neuvotteluin. Mikäli sovintoon ei päästä, riita ratkaistaan Helsingin käräjäoikeudessa.
                    </Text>
                </LegalSection>

                <LegalSection num="11" title="Muutokset käyttöehtoihin">
                    <Text className="text-sm leading-6 text-slate-600">
                        AI-Bookkeeper pidättää oikeuden muuttaa näitä Ehtoja. Muutoksista ilmoitetaan Käyttäjälle sähköpostitse tai Palvelun sisäisellä ilmoituksella vähintään 14 vuorokautta ennen muutosten voimaantuloa. Jatkamalla Palvelun käyttöä Käyttäjä hyväksyy päivitetyt Ehdot.
                    </Text>
                </LegalSection>

                <LegalSection num="12" title="Yhteystiedot">
                    <Text className="text-sm leading-6 text-slate-600">AI-Bookkeeper</Text>
                    <Text className="text-sm leading-6 text-slate-600">Sähköposti: nuutti.nyyssonen@gmail.com</Text>
                </LegalSection>
            </View>
        </ScrollView>
    );
};
