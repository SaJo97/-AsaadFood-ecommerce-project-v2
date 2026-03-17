import { FaRegUserCircle } from "react-icons/fa";
import FormLogin from "./components/FormLogin";
import { Link } from "react-router";

const Login = () => {
  return (
    <>
      {/* SEO Metadata */}
      <title>Logga in | Asaad Food</title>
      <meta
        name="description"
        content="Logga in hos Asaad Food för att hantera beställningar, fakturor och ditt företagsprofil enkelt och säkert."
      />

      <main
        className="flex flex-col items-center p-5 md:p-0"
        aria-labelledby="login-heading"
        role="main"
      >
        <div className="flex flex-col items-center gap-5 max-w-225">
          <FaRegUserCircle size={150} aria-hidden="true" focusable="false" />
          <h1
            id="login-heading"
            className="text-[24px] font-raleway md:text-[28px] lg:text-[32px] text-center"
          >
            Logga in på ditt konto
          </h1>
          <section className="border-2 p-4 rounded flex flex-col gap-10">
            {/* Login form */}
            <div className="text-[18px] font-raleway md:text-[20px] lg:text-[24px]">
              <FormLogin />
            </div>
            {/* Link to register page */}
            <div className="flex flex-col items-center text-[18px] font-raleway md:text-[20px] lg:text-[24px]">
              <p>Har du inget konto?</p>
              <Link to="/auth/registrera">
                <button
                  className="hover:underline cursor-pointer hover:text-[#1E5BCC]"
                  aria-label="Registrera nytt konto"
                >
                  Registrera
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};
export default Login;
