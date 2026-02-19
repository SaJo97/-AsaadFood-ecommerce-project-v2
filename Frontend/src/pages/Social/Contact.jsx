import ContactForm from "./components/ContactForm";

const Contact = () => {
  return (
    <>
      {/* SEO Metadata */}
      <title>Kontakta oss | Asaad Food</title>
      <meta
        name="description"
        content="Här kan du komma i kontakta med Asaad Food för allmänna frågor."
      />

      <main className="flex flex-col items-center">
        <div className="w-full max-w-225 flex flex-col gap-10">
          <div className="flex flex-col items-center gap-5">
            <h2 className="text-center font-crimsontext font-bold mt-10 md:mt-0 text-[18px] md:text-[24px] lg:text-[32px]">
              Här kan du nå oss
            </h2>
            <span className="block w-52.5 h-0.5 bg-[#898989]"></span>
          </div>
          <ContactForm />
          <p className="text-center text-[#696969] font-crimsontext mb-10 md:mb-0 text-[16px] md:text-[16px] lg:text-[18px] underline">
            ASAAD FOOD AB <br />
            Svarvarvägen 10, 142 50 Skogås <br />
            info@asaadfood.se
          </p>
        </div>
      </main>
    </>
  );
};
export default Contact;
