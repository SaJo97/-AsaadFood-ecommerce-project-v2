import { logout} from "@/store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import UpdateInfo from "./components/UpdateInfo";
import { useEffect, useRef } from "react";
import { fetchCurrentUser } from "@/store/user/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, role, loading, error } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.users);

  useEffect(() => {
    if (email) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, email]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/logga-in");
  };

  // Show loading while checking auth
  if (loading.checkAuth) {
    return (
      <main
        role="main"
        aria-busy="true"
        className="flex justify-center items-center p-6"
      >
        <p role="status" aria-live="polite">
          Laddar din profil...
        </p>
      </main>
    );
  }

  // handle not logged in
  if (!email) {
    return (
      <main role="main" className="p-6 text-center">
        <h1 className="text-xl font-bold">Inte inloggad</h1>
        <p className="mt-2">
          Du är inte inloggad.{" "}
          <Link
            to="/auth/logga-in"
            className="text-blue-600 underline focus:outline focus:outline-blue-500"
            aria-label="Gå till inloggningssidan"
          >
            Logga in
          </Link>{" "}
          för att visa din profil.
        </p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main
        role="main"
        aria-busy="true"
        className="flex justify-center items-center p-6"
      >
        <p role="status" aria-live="polite">
          Laddar användardata...
        </p>
      </main>
    );
  }
  const handleNavClick = (callback) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (callback) callback();
  };
  return (
    <>
      {/* SEO Metadata */}
      <title>Profil | Asaad Food</title>
      <meta
        name="description"
        content="Profil - Hantera dina personuppgifter, kontoinställningar och administratörsfunktioner för ditt Asaad Food-konto."
      />
      <meta name="robots" content="noindex, nofollow" />

      <main
        role="main"
        aria-labelledby="profile-heading"
        className="flex flex-col items-center p-5 md:p-0 font-crimsontext"
      >
        <section
          aria-describedby="profile-description"
          className="flex flex-col gap-4 max-w-225 bg-[#f9f9f9] p-2 md:p-5 rounded-4xl shadow-xs"
        >
          <header>
            <h1
              id="profile-heading"
              className="font-bold px-5 pt-4 md:px-0 text-lg md:text-[24px] "
            >
              Hej, {currentUser?.contactPerson?.firstName}!
            </h1>
            <p id="profile-description" className="sr-only">
              Detta är din profilsida där du kan uppdatera dina uppgifter och
              hantera ditt konto.
            </p>
          </header>
          {/* Logout Button */}
          <div className="px-5 md:p-0 mb-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-full px-4 py-2 bg-[#1E5BCC] text-white md:text-[20px]"
              aria-label="Logga ut från ditt konto"
            >
              Logga ut
            </button>
          </div>
          {/* Update Information Section */}
          <section className="w-fit" aria-labelledby="update-info-heading">
            <h2 id="update-info-heading" className="sr-only">
              Uppdatera dina uppgifter
            </h2>
            <UpdateInfo />
          </section>
          {/* Admin Panel Link (Only if Admin) */}
          {role === "admin" && (
            <nav aria-label="Administrationslänkar" className="p-5 md:p-0">
              <Link
                to="/adminpanel"
                className="inline-block px-4 py-2 bg-[#1E5BCC] text-white text-lg md:text-[24px] rounded focus:outline focus:outline-offset-2 focus:outline-blue-600"
                aria-label="Gå till adminpanelen"
                onClick={() => handleNavClick()}
              >
                Adminpanel
              </Link>
            </nav>
          )}
        </section>
      </main>
    </>
  );
};
export default Profile;
