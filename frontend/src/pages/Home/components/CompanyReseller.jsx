import coop from "@/assets/reseller/coop.svg";
import costco from "@/assets/reseller/costco.svg";
import fyndmarknad from "@/assets/reseller/fyndmarknad.svg";
import hemkop from "@/assets/reseller/hemkop.svg";
import hypermat from "@/assets/reseller/hypermat.svg";
import ica from "@/assets/reseller/ica.svg";
import lidl from "@/assets/reseller/lidl.svg";
import matrebellen from "@/assets/reseller/matrebellen.svg";
import tempo from "@/assets/reseller/tempo.svg";
import willys from "@/assets/reseller/willys.svg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useMemo } from "react";

const CompanyReseller = () => {
  // Array of resellers for easier mapping using Memo for unnecessary re-renders
  const resellers = useMemo(() => [
    { src: hemkop, alt: "Hemköp - officiell återförsäljare av Asaad Food" },
    { src: hypermat, alt: "Hypermat - officiell återförsäljare av Asaad Food" },
    { src: tempo, alt: "Tempo - officiell återförsäljare av Asaad Food" },
    { src: ica, alt: "ICA - officiell återförsäljare av Asaad Food" },
    {
      src: matrebellen,
      alt: "Matrebellen - officiell återförsäljare av Asaad Food",
    },
    {
      src: fyndmarknad,
      alt: "Fyndmarknad - officiell återförsäljare av Asaad Food",
    },
    { src: lidl, alt: "Lidl - officiell återförsäljare av Asaad Food" },
    { src: willys, alt: "Willys - officiell återförsäljare av Asaad Food" },
    { src: coop, alt: "Coop - officiell återförsäljare av Asaad Food" },
    { src: costco, alt: "Costco - officiell återförsäljare av Asaad Food" },
  ]);

  return (
    <main
      className="flex flex-col text-center border border-[#1E5BCC]"
      aria-labelledby="resellers-heading"
    >
      <header className="bg-[#1E5BCC] p-5">
        <h2 className="text-white font-crimsontext lg:text-[32px] text-[18px] font-bold" id="resellers-heading">Våra återförsäljare</h2>
      </header>

      {/* Mobile Carousel */}
      <section
        className="flex md:hidden"
        aria-label="Karusell med våra återförsäljare"
      >
        <Carousel
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          aria-label="Karusell med våra återförsäljares logotyper"
        >
          <CarouselContent className="p-1">
            {resellers.map((reseller, index) => (
              <CarouselItem
                key={index}
                className="flex justify-center"
                aria-label={`Återförsäljare: ${reseller.name}`}
              >
                <img
                  src={reseller.src}
                  alt={reseller.alt}
                  decoding="auto"
                  loading="eager"
                  width="80"
                  height="80"
                  className="w-auto h-auto"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious aria-label="Visa föregående återförsäljare" />
          <CarouselNext aria-label="Visa nästa återförsäljare" />
        </Carousel>
      </section>

      {/* Desktop Grid */}
      <section
        className="hidden md:flex"
        aria-label="Lista över våra återförsäljare"
      >
        <ul className="grid grid-cols-5 p-5" role="list">
          {resellers.map((reseller, index) => (
            <li key={index} role="listitem">
              <img
                src={reseller.src}
                alt={reseller.alt + "."}
                decoding="async"
                loading="lazy"
                fetchPriority="low"
                width="80"
                height="80"
                className="w-auto h-auto"
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default CompanyReseller;
