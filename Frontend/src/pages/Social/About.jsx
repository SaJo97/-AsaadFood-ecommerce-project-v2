import Logo from "@/assets/Logo-small.svg";
import mahmoodimg from "@/assets/bildmahmoodris.svg";

const About = () => {
  return (
    <>
      {/* SEO Metadata */}
      <title>Om oss | Asaad Food</title>
      <meta name="description" content="Lär känna oss i Asaad Food" />

      <main
        className="flex flex-col items-center"
        aria-labelledby="about-heading"
      >
        <div className="w-full max-w-225">
          <ul className="flex flex-col items-center gap-0">
            <li className="p-6 w-h-[114px]">
              <h1
                className="font-crimsontext font-bold text-[18px] md:text-[32px]"
                id="about-heading"
              >
                Berika Sveriges middagsbord med världen
              </h1>
            </li>
            <li>
              <img
                src={Logo}
                alt="Asaad Food - svensk importör av ris och olivolja"
                width="365"
                height="140"
                loading="eager"
                decoding="async"
                aria-label="Asaad Food logotyp"
              />
            </li>
            <li>
              <section
                aria-label="Om Asaad Food"
                className="text-[#1E5BCC] font-quattrocento font-bold text-[18px] md:text-[24px] flex flex-col gap-5 text-center max-w-212.5 p-5"
              >
                <p>
                  Vi är en livsmedelsimportör med fokus på högkvalitativt ris
                  och olivolja. Sedan 1989 har vi arbetat direkt med producenter
                  och leverantörer för att föra in utvalda produkter till den
                  svenska marknaden. Vår resa började när grundaren Asaad
                  började importera ris från Thailand till sin lilla
                  närlivsbutik på Hornsgatan i Stockholm. Behovet av bättre och
                  mer varierat utbud var stort, och det ledde till att Sazan,
                  vår livsmedelsgrossist, etablerades i Vårberg.
                </p>

                <p>
                  Under de 30 år som har gått har både marknaden och kundernas
                  smak förändrats. Idag är vi stolta över att kunna erbjuda ris
                  och olivolja av högsta kvalitet, noggrant utvalda för att möta
                  de krav våra kunder ställer på både smak och ursprung.
                </p>

                <p>
                  På Asaad Food strävar vi efter att återskapa den genuina
                  torgkänslan där kvalitet och tradition står i fokus. Det är en
                  känsla som många kunder värderar högt när de väljer sin
                  matbutik.
                </p>

                <p>
                  Oavsett om vi levererar till företag eller privatpersoner ser
                  vi alltid kundens verksamhet och behov som våra egna. Vi är
                  här för att bygga långsiktiga relationer och erbjuda pålitliga
                  produkter som våra kunder kan lita på.
                </p>
              </section>
            </li>
            <li className="w-full">
              <img
                src={mahmoodimg}
                alt="Mahmood ris - högkvalitativa risprodukter importerade av Asaad Food"
                width="375"
                height="159"
                loading="lazy"
                decoding="async"
                className="w-full max-w-225 h-auto mx-auto"
                aria-label="Produktbild på Mahmood ris"
              />
            </li>
          </ul>
        </div>
      </main>
    </>
  );
};
export default About;
