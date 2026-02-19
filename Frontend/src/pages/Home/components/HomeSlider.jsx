import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import mahmoodLogo from "@/assets/mahmoodrice.svg";
import kangarooLogo from "@/assets/doublekangaroo.svg";
import chefLogo from "@/assets/smartchef.svg";
import sevimliLogo from "@/assets/sevimli.svg";
import bassoLogo from "@/assets/bassologo.svg";
import basso1 from "@/assets/basso1.svg";
import basso2 from "@/assets/basso2.svg";
import basso3 from "@/assets/basso3.svg";
import Autoplay from "embla-carousel-autoplay";
const HomeSlider = () => {
  return (
    <section
      className="border border-[#1E5BCC] drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
      aria-labelledby="home-slider-heading"
    >
      <h2 id="home-slider-heading" className="sr-only">
        Produktkarusell – ris och olivolja från Asaad Food
      </h2>
      <Carousel
        plugins={[Autoplay({ delay: 10000, stopOnInteraction: false })]}
        aria-label="Produktkarusell med risvarumärken och olivolja"
        aria-roledescription="carousel"
      >
        <CarouselContent className="flex will-change-transform">
          {/* Slide 1 – Rice brands */}
          <CarouselItem aria-label="Risvarumärken">
            <article className="font-quattrocento font-bold text-[#1E5BCC] text-[16px] lg:text-[24px]  p-3.5 lg:p-5">
              <div className="flex flex-col md:flex md:flex-row md:gap-20">
                <div className="flex flex-col gap-5 p-2 lg:p-5">
                  <h3 className="sr-only">Risvarumärken</h3>
                  <h2>Upptäck våra välkända risvarumärken!</h2>
                  <p>
                    Vi arbetar direkt med ledande producenter och leverantörer
                    för att säkerställa att vi alltid kan erbjuda våra kunder
                    produkter av högsta kvalitet. Vårt fockus är att leverera
                    det bästa - varje gång!
                  </p>
                </div>
                <img
                  src={mahmoodLogo}
                  alt="Mahmood Rice – premiumris importerad av Asaad Food."
                  decoding="async"
                  loading="eager"
                  fetchPriority="high"
                  width="200" // Approximate dimensions to prevent CLS
                  height="200"
                  className="hidden md:flex w-50 h-50 lg:w-auto lg:h-auto"
                />
              </div>
              <ul
                className="flex flex-wrap justify-between gap-1 px-5 lg:pt-10 items-center"
                aria-label="Våra risvarumärken"
              >
                <li className="md:hidden flex">
                  <img
                    src={mahmoodLogo}
                    alt="Mahmood Rice – premiumris importerad av Asaad Food"
                    decoding="async"
                    loading="lazy"
                    // fetchPriority="high"
                    width="100" // Prevents CLS
                    height="90"
                    className="flex lg:hidden w-25 h-22.5 lg:w-auto lg:h-auto"
                  />
                </li>
                <li>
                  <img
                    src={sevimliLogo}
                    alt="Sevimli ris – officiellt varumärke hos Asaad Food"
                    decoding="async"
                    loading="lazy"
                    // fetchPriority="high"
                    width="100"
                    height="90"
                    className="w-25 h-22.5 lg:w-auto lg:h-auto md:w-40 md:h-40 "
                  />
                </li>
                <li>
                  <img
                    src={kangarooLogo}
                    alt="Double Kangaroo ris – kvalitetsris från Asaad Food"
                    decoding="async"
                    loading="lazy"
                    // fetchPriority="high"
                    width="100"
                    height="90"
                    className="w-25 h-22.5 lg:w-auto lg:h-auto md:w-40 md:h-40 "
                  />
                </li>
                <li>
                  <img
                    src={chefLogo}
                    alt="Smart Chef ris – professionellt ris för restauranger"
                    decoding="async"
                    loading="lazy"
                    // fetchPriority="high"
                    width="100"
                    height="90"
                    className="w-25 h-22.5 lg:w-auto lg:h-auto md:w-40 md:h-40 "
                  />
                </li>
              </ul>
            </article>
          </CarouselItem>

          {/* Slide 2 – Olive oil */}
          <CarouselItem aria-label="Olivolja Basso">
            <article className="font-quattrocento font-bold text-[#1E5BCC] text-[16px] lg:text-[24px]  p-3.5 lg:p-5">
              <div className="flex flex-col md:flex md:flex-row md:gap-20">
                <div className="flex flex-col gap-5 p-2 lg:p-5">
                  <h3 className="sr-only">Basso olivolja</h3>
                  <h2>Upptäck vår utsökta olivolja Basso!</h2>
                  <p>
                    Vi samarbetar nära med traditionella olivodlingar i
                    Medelhavet för att garantera autentisk smak och hållbar
                    produktion. Vårt löfte är att föra den rena, extra
                    jungfruliga kvaliteten direkt till ditt kök - varje flaska!
                  </p>
                </div>
                <img
                  src={bassoLogo}
                  alt="Basso – extra jungfrulig olivolja av hög kvalitet"
                  decoding="async"
                  loading="lazy"
                  width="200"
                  height="200"
                  className="hidden md:flex w-50 h-50 lg:w-auto lg:h-auto"
                />
              </div>
              <ul
                className="flex flex-wrap justify-between gap-1 px-5 lg:pt-10 items-center"
                aria-label="Basso olivolja produkter"
              >
                <li className="md:hidden flex">
                  <img
                    src={bassoLogo}
                    alt="Basso olivolja logotyp"
                    decoding="async"
                    loading="lazy"
                    width="100"
                    height="90"
                    className="flex lg:hidden w-25 h-22.5 lg:w-auto lg:h-auto"
                  />
                </li>
                <li>
                  <img
                    src={basso1}
                    alt="basso olivolja produkt1"
                    decoding="async"
                    loading="lazy"
                    width="100"
                    height="90"
                    className="w-25 h-22.5 lg:w-auto lg:h-auto md:w-40 md:h-40 "
                  />
                </li>
                <li>
                  <img
                    src={basso2}
                    alt="basso olivolja produkt2"
                    decoding="async"
                    loading="lazy"
                    width="100"
                    height="90"
                    className="w-25 h-22.5 lg:w-auto lg:h-auto md:w-40 md:h-40 "
                  />
                </li>
                <li>
                  <img
                    src={basso3}
                    alt="basso olivolja produkt3"
                    decoding="async"
                    loading="lazy"
                    width="100"
                    height="90"
                    className="w-25 h-22.5 lg:w-auto lg:h-auto md:w-40 md:h-40 "
                  />
                </li>
              </ul>
            </article>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious
          aria-label="Visa föregående bild i produktkarusellen"
          className="hidden md:flex"
        />
        <CarouselNext
          aria-label="Visa nästa bild i produktkarusellen"
          className="hidden md:flex"
        />
      </Carousel>
    </section>
  );
};
export default HomeSlider;
