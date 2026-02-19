import FormInput from "@/components/FormInput";
import useForm from "@/hooks/useForm";
import { clearError, login } from "@/store/auth/authSlice";
import { useEffect, useState } from "react";
import { FaLock, FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

const FormLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector((state) => state.auth.loading.login);
  const error = useSelector((state) => state.auth.error.login);

  const { form: formData, handleChange } = useForm({
    loginEmail: "",
    password: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setHasSubmitted(true);
    dispatch(clearError());

    if (!formData.loginEmail || !formData.password) return;

    try {
      await dispatch(login(formData)).unwrap();
      console.log("Login successful");
      // console.log(formData);
      navigate(`/konto`);
    } catch (err) {
      console.error("register failed", err);
    }
  };

  // clear when leaving page
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [location.pathname, dispatch]);
  // clear error
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  return (
    <section aria-label="Login form">
      <form
        className="flex flex-col gap-3"
        noValidate
        onSubmit={onSubmit}
        aria-describedby={error ? "login-error" : undefined}
      >
        {error && (
          <p className="text-[#D12323]" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        <FormInput
          label={`E-postadress`}
          name="loginEmail"
          id="loginEmail"
          type="email"
          icon={FaRegUser}
          value={formData.loginEmail}
          onChange={handleChange}
          errorMsg={
            hasSubmitted && !formData.loginEmail ? "E-postadress krävs" : ""
          }
          aria-required="true"
          required={true}
        />
        <FormInput
          label="Lösenord"
          name="password"
          id="password"
          type="password"
          icon={FaLock}
          value={formData.password}
          onChange={handleChange}
          errorMsg={hasSubmitted && !formData.password ? "Lösenord krävs" : ""}
          aria-required="true"
          required={true}
        />
        <button
          type="submit"
          className="bg-[#1E5BCC] text-white rounded border border-black p-1 cursor-pointer hover:bg-[#1747A3]"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>
    </section>
  );
};
export default FormLogin;
