import FormInput from "@/components/FormInput";
import useForm from "@/hooks/useForm";
import {
  clearError,
  fetchCurrentUser,
  updateUserInfo,
} from "@/store/user/userSlice";
import { useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

// Update user (only specific fields: password, phoneNumber, invoiceEmail, companyAddress(streetAddress, postalCode, city,))
const UpdateInfo = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.users);
  const { currentUser } = userState;
  const loading =
    userState.loading.fetchCurrentUser || userState.loading.updateUserInfo;
  const error =
    userState.error.fetchCurrentUser || userState.error.updateUserInfo;

  const [editingFields, setEditingFields] = useState({
    password: false,
    phone: false,
    invoiceEmail: false,
    streetAddress: false,
    postalCode: false,
    city: false,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Memoize initialFormData to only recalculate when currentUser changes
  const initialFormData = useMemo(
    () => ({
      password: "*********",
      confirmPassword: "",
      phone: currentUser?.contactPerson?.phone || "",
      invoiceEmail: currentUser?.invoiceEmail || "",
      streetAddress: currentUser?.company?.address?.street || "",
      postalCode: currentUser?.company?.address?.postalCode || "",
      city: currentUser?.company?.address?.city || "",
    }),
    [currentUser],
  );

  const {
    form: formData,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
    setForm,
  } = useForm(initialFormData);

  const handleInputChange = (e) => {
    if (error) dispatch(clearError());
    handleChange(e);
  };

  // Fetch current user if not in state
  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    } else {
      setForm(initialFormData);
    }
  }, [currentUser, setForm]);

  // Handle save for a specific field
  const handleSaveField = (fieldName) => {
    if (!currentUser) {
      console.error("Current user not available");
      return;
    }

    setHasSubmitted(true);

    const fieldsToValidate =
      fieldName === "password" ? ["password", "confirmPassword"] : [fieldName];

    const result = handleSubmit(null, fieldsToValidate);
    console.log(result);
    if (!result.success) return;

    // Prepare userInfo with only the changed field
    const userInfo = {};

    if (fieldName === "password" && formData.password) {
      userInfo.password = formData.password;
    } else if (formData[fieldName] !== initialFormData[fieldName]) {
      userInfo[fieldName] = formData[fieldName];
    }

    // Dispatch update
    dispatch(updateUserInfo({ id: currentUser._id, userInfo }))
      .unwrap()
      .then(() => {
        setEditingFields((prev) => ({ ...prev, [fieldName]: false })); // Disable editing
        setHasSubmitted(false);
        dispatch(fetchCurrentUser()); // Refresh data
      })
      .catch((err) => {
        console.error("Uppdatering misslyckades", err);
      });
  };

  // Toggle editing for a field
  const toggleEditing = (fieldName, reset = false) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
    if (reset) {
      // Reset the field value to initialFormData
      setForm((prev) => ({
        ...prev,
        [fieldName]: initialFormData[fieldName],
        ...(fieldName === "password" ? { confirmPassword: "" } : {}),
      }));
      setHasSubmitted(false); // Clear submitted errors
      if (error) dispatch(clearError()); // Clear Redux errors
    }
  };

  const formatPostalCode = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    return digits.slice(0, 3) + " " + digits.slice(3, 5);
  };

  return (
    <section
      aria-labelledby="user-info-heading"
      className="p-0 sm:p-4 flex flex-col gap-1 md:text-[24px]"
    >
      <header>
        <h2
          id="user-info-heading"
          className="underline text-center font-bold mb-3 text-[24px]"
        >
          Din information
        </h2>
        <p className="sr-only">
          Här kan du uppdatera dina kontouppgifter och företagsinformation.
        </p>
      </header>
      {/* Loading */}
      {loading && (
        <p
          className="text-center"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          Laddar användaruppgifter...
        </p>
      )}
      {/* Global Error */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-[#D12323] flex flex-wrap"
        >
          {error?.message ||
            JSON.stringify(error) ||
            "Ett fel uppstod. Försök igen."}
        </div>
      )}

      {!currentUser && !loading && (
        <p role="status" className="text-center">
          Logga in för att hämta din information.
        </p>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        aria-describedby="form-description"
      >
        <p id="form-description" className="sr-only">
          Varje sektion kan redigeras separat. Klicka på ändra för att aktivera
          redigering.
        </p>

        {/* Password Section */}
        <fieldset
          className="p-3 border bg-white"
          aria-labelledby="password-legend"
        >
          <legend id="password-legend" className="font-semibold">
            Lösenord
          </legend>
          <div className="flex gap-1">
            <div className="flex flex-col">
              <FormInput
                label="Nytt lösenord"
                name="password"
                id="password"
                type="password"
                icon={FaLock}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={!editingFields.password}
                errorMsg={
                  hasSubmitted ? errors.password || error?.password : ""
                }
                aria-required={editingFields.password}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              {editingFields.password && (
                <FormInput
                  label="Bekräfta Lösenord"
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  icon={FaLock}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={!editingFields.password}
                  errorMsg={
                    hasSubmitted
                      ? errors.confirmPassword || error?.confirmPassword
                      : ""
                  }
                  aria-required={!!formData.password}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby="confirmPassword-error"
                />
              )}
            </div>
            <div className="p-1 mt-8 md:mt-11">
              {!editingFields.password ? (
                <button
                  type="button"
                  onClick={() => toggleEditing("password")}
                  className="px-4 py-1.5 bg-[#1E5BCC] text-white rounded focus:outline  focus:outline-offset-2"
                  disabled={loading}
                >
                  Ändra
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleSaveField("password")}
                    className="px-4 py-1.5 bg-green-700 text-white rounded focus:outline  focus:outline-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Uppdaterar..." : "Spara"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEditing("password", true)}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded focus:outline  focus:outline-offset-2"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Phone Section */}
        <fieldset
          className="p-3 border bg-white"
          aria-labelledby="contact-legend"
        >
          <legend id="contact-legend" className="font-semibold">
            Kontaktuppgifter
          </legend>

          <div className="flex gap-1">
            <FormInput
              label="Telefonnummer"
              name="phone"
              id="phone"
              type="tel"
              icon={FaPhone}
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={!editingFields.phone}
              errorMsg={hasSubmitted ? errors.phone || error?.phone : ""}
              aria-required="true"
              required={editingFields.phone}
              aria-invalid={!!errors.phone}
            />
            <div className="p-1 mt-8 md:mt-11">
              {!editingFields.phone ? (
                <button
                  type="button"
                  onClick={() => toggleEditing("phone")}
                  className="px-4 py-1.5 bg-[#1E5BCC] text-white rounded focus:outline  focus:outline-offset-2"
                  disabled={loading}
                >
                  Ändra
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleSaveField("phone")}
                    className="px-4 py-1.5 bg-green-700 text-white rounded focus:outline  focus:outline-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Uppdaterar..." : "Spara"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEditing("phone", true)}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded focus:outline  focus:outline-offset-2"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Invoice Email Section */}
          <div className="flex gap-1">
            <FormInput
              label="Faktura E-post"
              name="invoiceEmail"
              id="invoiceEmail"
              type="email"
              icon={FaEnvelope}
              value={formData.invoiceEmail}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={!editingFields.invoiceEmail}
              errorMsg={
                hasSubmitted ? errors.invoiceEmail || error?.invoiceEmail : ""
              }
              aria-required="true"
              required={editingFields.invoiceEmail}
              aria-invalid={!!errors.invoiceEmail}
            />
            <div className="p-1 mt-8 md:mt-11">
              {!editingFields.invoiceEmail ? (
                <button
                  type="button"
                  onClick={() => toggleEditing("invoiceEmail")}
                  className="px-4 py-1.5 bg-[#1E5BCC] text-white rounded focus:outline  focus:outline-offset-2"
                  disabled={loading}
                >
                  Ändra
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleSaveField("invoiceEmail")}
                    className="px-4 py-1.5 bg-green-700 text-white rounded focus:outline  focus:outline-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Uppdaterar..." : "Spara"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEditing("invoiceEmail", true)}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded focus:outline  focus:outline-offset-2"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>
        {/* Company info */}
        <fieldset
          className="p-4 border bg-white"
          aria-labelledby="company-legend"
        >
          <legend id="company-legend" className="font-semibold">
            Företagsuppgifter
          </legend>

          {/* Street Address Section */}
          <div className="flex gap-1">
            <FormInput
              label="Gatuadress"
              name="streetAddress"
              id="streetAddress"
              type="text"
              icon={FaMapMarkerAlt}
              value={formData.streetAddress}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={!editingFields.streetAddress}
              errorMsg={
                hasSubmitted ? errors.streetAddress || error?.streetAddress : ""
              }
              aria-required="true"
              required={editingFields.streetAddress}
            />
            <div className="p-1 mt-8 md:mt-11">
              {!editingFields.streetAddress ? (
                <button
                  type="button"
                  onClick={() => toggleEditing("streetAddress")}
                  className="px-4 py-1.5 bg-[#1E5BCC] text-white rounded focus:outline  focus:outline-offset-2"
                  disabled={loading}
                >
                  Ändra
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleSaveField("streetAddress")}
                    className="px-4 py-1.5 bg-green-700 text-white rounded focus:outline  focus:outline-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Uppdaterar..." : "Spara"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEditing("streetAddress", true)}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded focus:outline  focus:outline-offset-2"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Postal Code Section */}
          <div className="flex gap-1">
            <FormInput
              label="Postnummer"
              name="postalCode"
              id="postalCode"
              type="text"
              icon={FaMapMarkerAlt}
              value={formData.postalCode}
              onChange={(e) =>
                handleInputChange({
                  target: {
                    name: "postalCode",
                    value: formatPostalCode(e.target.value),
                  },
                })
              }
              onBlur={handleBlur}
              disabled={!editingFields.postalCode}
              errorMsg={
                hasSubmitted ? errors.postalCode || error?.postalCode : ""
              }
              aria-required="true"
              required={editingFields.postalCode}
            />
            <div className="p-1 mt-8 md:mt-11">
              {!editingFields.postalCode ? (
                <button
                  type="button"
                  onClick={() => toggleEditing("postalCode")}
                  className="px-4 py-1.5 bg-[#1E5BCC] text-white rounded focus:outline  focus:outline-offset-2"
                  disabled={loading}
                >
                  Ändra
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleSaveField("postalCode")}
                    className="px-4 py-1.5 bg-green-700 text-white rounded focus:outline  focus:outline-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Uppdaterar..." : "Spara"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEditing("postalCode", true)}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded focus:outline  focus:outline-offset-2"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* City Section */}
          <div className="flex gap-1">
            <FormInput
              label="Stad"
              name="city"
              id="city"
              type="text"
              icon={FaMapMarkerAlt}
              value={formData.city}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={!editingFields.city}
              errorMsg={hasSubmitted ? errors.city || error?.city : ""}
              aria-required="true"
              required={editingFields.city}
            />
            <div className="p-1 mt-8 md:mt-11">
              {!editingFields.city ? (
                <button
                  type="button"
                  onClick={() => toggleEditing("city")}
                  className="px-4 py-1.5 bg-[#1E5BCC] text-white rounded focus:outline  focus:outline-offset-2"
                  disabled={loading}
                >
                  Ändra
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleSaveField("city")}
                    className="px-4 py-1.5 bg-green-700 text-white rounded focus:outline  focus:outline-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Uppdaterar..." : "Spara"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEditing("city", true)}
                    className="px-4 py-1.5 bg-gray-500 text-white rounded focus:outline  focus:outline-offset-2"
                  >
                    Avbryt
                  </button>
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default UpdateInfo;
