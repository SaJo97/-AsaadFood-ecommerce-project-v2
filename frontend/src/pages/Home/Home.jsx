import CompanyReseller from "./components/CompanyReseller";
import HomeSlider from "./components/HomeSlider";

const Home = () => {
  return (
    <main className="flex flex-col items-center lg:gap-12.5 md:gap-10">
      <div className="w-full max-w-250">
        <HomeSlider />
      </div>
      <section className="w-full max-w-250 mx-auto px-6 py-2 md:text-xl 2xl:text-[24px] leading-relaxed text-center border border-[#1E5BCC]">
        <h1 className="md:text-3xl text-lg font-bold mb-4 font-crimsontext">
          Grossist och Importör av Premium Ris & Olivolja för Företag i Sverige
        </h1>
        <div className="text-[#1E5BCC] font-quattrocento">
          <p>
            Asaad Food är en svensk grossist och importör som specialiserar sig
            på premiumris och extra jungfrulig olivolja för företag. Vi
            levererar högkvalitativa livsmedelsprodukter till restauranger,
            storkök, livsmedelsbutiker och återförsäljare över hela Sverige.
          </p>

          <p className="mt-4">
            Genom nära samarbeten med ledande producenter kan vi säkerställa
            konsekvent kvalitet, konkurrenskraftiga priser och stabil tillgång.
            Vårt sortiment inkluderar välkända rismärken som Mahmood, Sevimli,
            Double Kangaroo och Smart Chef – uppskattade av professionella kök
            och butiker som ställer höga krav på smak, textur och pålitlighet.
          </p>

          <p className="mt-4">
            Vi erbjuder även Basso extra jungfrulig olivolja, producerad med
            traditionell expertis från Medelhavet. Produkten är särskilt
            anpassad för restauranger och livsmedelsbutiker som söker autentisk
            smak, hög kvalitet och kostnadseffektiva volymer för daglig
            användning.
          </p>

          <p className="mt-4">
            Som B2B-leverantör förstår vi vikten av punktlig logistik,
            transparent kommunikation och långsiktiga affärsrelationer. Vi
            arbetar nära våra kunder för att skapa trygga samarbeten och
            effektiva inköpslösningar anpassade efter verksamhetens behov.
          </p>

          <p className="mt-4">
            Oavsett om du driver restaurang, grossistverksamhet, livsmedelsbutik
            eller cateringföretag kan vi erbjuda en stabil och pålitlig
            leveranskedja inom ris och olivolja. Vår ambition är att vara en
            långsiktig partner för företag i hela Sverige.
          </p>
        </div>

        <p className="mt-4 font-semibold font-crimsontext text-lg md:text-2xl">
          Observera att vi endast säljer till företag och registrerade
          verksamheter.
        </p>
      </section>
      <div className="w-full max-w-250">
        <CompanyReseller />
      </div>
    </main>
  );
};
export default Home;
