import FormInput from "@/components/FormInput";
import useForm from "@/hooks/useForm";
import { clearError, clearMessage, register } from "@/store/auth/authSlice";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { FaMobileAlt, FaRegBuilding, FaLock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RiMailLine, RiUser6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const FormRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    form: formData,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useForm({
    orgNumber: "",
    companyName: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    firstName: "",
    lastName: "",
    phone: "",
    loginEmail: "",
    invoiceEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const selectRegisterState = createSelector(
    (state) => state.auth,
    (auth) => ({
      loading: auth.loading.register,
      error: auth.error.register,
      message: auth.message,
    }),
  );

  const { loading, error, message } = useSelector(selectRegisterState);

  // Clear errors/messages when user types
  const handleInputChange = (e) => {
    if (error) dispatch(clearError());
    if (message) dispatch(clearMessage());
    handleChange(e);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(clearMessage());
    setHasSubmitted(true);

    const { success, form: values } = handleSubmit(e);
    console.log(values);
    if (!success) return;

    const userData = {
      orgNumber: values.orgNumber,
      companyName: values.companyName,
      streetAddress: values.streetAddress,
      postalCode: values.postalCode,
      city: values.city,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      loginEmail: values.loginEmail,
      invoiceEmail: values.invoiceEmail,
      password: values.password,
    };

    try {
      await dispatch(register(userData)).unwrap();
      // console.log("register success");
      navigate(`/konto`);
    } catch (err) {
      console.error("register failed", err);
    }
  };

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const formatOrgNumber = (
    value, // onChange use it for auto format org-number
  ) => value.replace(/\D/g, "").replace(/^(\d{6})(\d{0,4}).*/, "$1-$2");

  const formatPostalCode = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    return digits.slice(0, 3) + " " + digits.slice(3, 5);
  };

  return (
    <section aria-label="Register form">
      <form
        className="flex flex-col gap-5"
        onSubmit={onSubmit}
        noValidate
        aria-describedby={error ? "register-error" : undefined}
      >
        {message && (
          <p className="text-center" role="status" aria-live="polite">
            {message}
          </p>
        )}
        {error && (
          <p
            id="register-error"
            className="text-[#D12323] text-center"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        {/* Företagsuppgifter */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-bold">Företagsuppgifter</legend>

          <FormInput
            label="Org. nummer"
            name="orgNumber"
            id="orgNumber"
            type="text"
            icon={FaRegBuilding}
            value={formData.orgNumber}
            onChange={(e) =>
              handleInputChange({
                target: {
                  name: "orgNumber",
                  value: formatOrgNumber(e.target.value),
                },
              })
            }
            errorMsg={hasSubmitted ? errors.orgNumber || error?.orgNumber : ""}
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <FormInput
            label="Företagsnamn"
            name="companyName"
            id="companyName"
            type="text"
            icon={FaRegBuilding}
            value={formData.companyName}
            onChange={handleInputChange}
            errorMsg={
              hasSubmitted ? errors.companyName || error?.companyName : ""
            }
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <FormInput
            label="Gatuadress"
            name="streetAddress"
            id="streetAddress"
            type="text"
            icon={FaLocationDot}
            value={formData.streetAddress}
            onChange={handleInputChange}
            errorMsg={
              hasSubmitted ? errors.streetAddress || error?.streetAddress : ""
            }
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <div className="flex flex-col gap-3 md:flex-row">
            <FormInput
              label="Postnr."
              name="postalCode"
              id="postalCode"
              type="text"
              icon={FaLocationDot}
              value={formData.postalCode}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: "postalCode",
                    value: formatPostalCode(e.target.value),
                  },
                })
              }
              errorMsg={
                hasSubmitted ? errors.postalCode || error?.postalCode : ""
              }
              onBlur={handleBlur}
              aria-required="true"
              required={true}
            />

            <FormInput
              label="Ort"
              name="city"
              id="city"
              type="text"
              icon={FaLocationDot}
              value={formData.city}
              onChange={handleInputChange}
              errorMsg={hasSubmitted ? errors.city || error?.city : ""}
              onBlur={handleBlur}
              aria-required="true"
              required={true}
            />
          </div>
        </fieldset>

        {/* Kontaktperson */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-bold">Kontaktperson</legend>

          <FormInput
            label="Förnamn"
            name="firstName"
            id="firstName"
            type="text"
            icon={RiUser6Line}
            value={formData.firstName}
            onChange={handleInputChange}
            errorMsg={hasSubmitted ? errors.firstName || error?.firstName : ""}
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <FormInput
            label="Efternamn"
            name="lastName"
            id="lastName"
            type="text"
            icon={RiUser6Line}
            value={formData.lastName}
            onChange={handleInputChange}
            errorMsg={hasSubmitted ? errors.lastName || error?.lastName : ""}
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <FormInput
            label="Telefonnummer"
            name="phone"
            id="phone"
            type="tel"
            icon={FaMobileAlt}
            value={formData.phone}
            onChange={handleInputChange}
            errorMsg={hasSubmitted ? errors.phone || error?.phone : ""}
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <FormInput
            label="E-postadress för inloggning"
            name="loginEmail"
            id="loginEmail"
            type="email"
            icon={RiMailLine}
            value={formData.loginEmail}
            onChange={handleInputChange}
            errorMsg={
              hasSubmitted ? errors.loginEmail || error?.loginEmail : ""
            }
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />
        </fieldset>

        {/* Faktura */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-bold">E-postadress för fakturor</legend>

          <FormInput
            label="E-postadress"
            name="invoiceEmail"
            id="invoiceEmail"
            type="email"
            icon={RiMailLine}
            value={formData.invoiceEmail}
            onChange={handleInputChange}
            errorMsg={
              hasSubmitted ? errors.invoiceEmail || error?.invoiceEmail : ""
            }
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />
        </fieldset>

        {/* Inloggning */}
        <fieldset className="flex flex-col gap-2">
          <legend className="font-bold">Inloggningsuppgifter</legend>

          <FormInput
            label="Lösenord"
            name="password"
            id="password"
            type="password"
            icon={FaLock}
            value={formData.password}
            onChange={handleInputChange}
            errorMsg={hasSubmitted ? errors.password || error?.password : ""}
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />

          <FormInput
            label="Bekräfta lösenord"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            icon={FaLock}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            errorMsg={
              hasSubmitted
                ? errors.confirmPassword || error?.confirmPassword
                : ""
            }
            onBlur={handleBlur}
            aria-required="true"
            required={true}
          />
        </fieldset>

        <button
          type="submit"
          className="bg-[#1E5BCC] text-white rounded border border-black p-1 cursor-pointer hover:bg-[#1747A3]"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Registrerar..." : "Registrera"}
        </button>
      </form>
    </section>
  );
};
export default FormRegister;
