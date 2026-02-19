import { Link } from "react-router";
import FormRegister from "./components/FormRegister";
import { FaRegUserCircle } from "react-icons/fa";

const Register = () => {
  return (
    <>
      {/* SEO Metadata */}
      <title>Skapa konto | Asaad Food</title>
      <meta
        name="description"
        content="Skapa ett nytt konto hos Asaad Food för att hantera beställningar, fakturor och ditt företagsprofil enkelt och säkert."
      />

      <main
        className="flex flex-col items-center p-5 md:p-0"
        role="main"
        aria-labelledby="register-heading"
      >
        <div className="flex flex-col items-center gap-5 max-w-225">
          <FaRegUserCircle size={150} aria-hidden="true" focusable="false" />
          <h1
            id="register-heading"
            className="text-center font-bold font-crimsontext text-[20px] md:text-[24px] lg:text-[32px]"
          >
            Skapa konto
          </h1>
          {/* Registration form */}
          <div className="text-[18px] font-raleway md:text-[20px] lg:text-[24px]">
            <FormRegister />
          </div>
          {/* Link to login page */}
          <div className="flex flex-col items-center text-[18px] font-raleway md:text-[20px] lg:text-[24px]">
            <p>Har du redan ett konto?</p>
            <Link to="/auth/logga-in">
              <button
                className="hover:underline cursor-pointer hover:text-[#1E5BCC]"
                aria-label="Logga in på ditt konto"
              >
                Logga in
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};
export default Register;
