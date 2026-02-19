import Modale from "@/components/Modale";
import { resetMessageState, sendMessage } from "@/store/message/messageSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ContactForm = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.message
  );

  const [formData, setFormData] = useState({
    contactPerson: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setModalVisible(true);
      setFormData({ contactPerson: "", email: "", message: "" });
      dispatch(resetMessageState());
    }
  }, [isSuccess, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "email" ? value.toLowerCase() : value, }));
  };

  const validate = () => {
    const formErrors = {};
    if (!formData.contactPerson.trim()) formErrors.contactPerson = "Namn krävs";
    if (!formData.email.trim()) formErrors.email = "E-post krävs";
    if (!formData.message.trim()) formErrors.message = "Meddelande krävs";
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    dispatch(sendMessage(formData));
  };

  return (
    <section
      aria-labelledby="contact-form-heading"
      className="p-6 bg-white border border-[#898989] rounded-2xl shadow-md font-crimsontext"
    >
      <header className="mb-6 text-center">
        <h2
          id="contact-form-heading"
          className="text-[18px] md:text-[24px] lg:text-[32px] font-bold text-black"
        >
          Kontaktformulär
        </h2>
        <p className="text-sm md:text-[16px] lg:text-[18px] text-[#696969]">
          Kontakta oss genom att fylla i formuläret nedan.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
        aria-describedby={isError ? "form-error" : undefined}
      >
        <fieldset className="space-y-5">
          <legend className="sr-only">Kontaktuppgifter</legend>

          {/* Contact person */}
          <div>
            <label
              htmlFor="contactPerson"
              className="block mb-1 text-sm md:text-[16px] lg:text-[18px] text-black"
            >
              Kontakt person
            </label>
            <input
              id="contactPerson"
              name="contactPerson"
              type="text"
              autoComplete="name"
              placeholder="namn"
              value={formData.contactPerson}
              onChange={handleChange}
              aria-invalid={!!errors.contactPerson}
              aria-describedby={
                errors.contactPerson ? "contactPerson-error" : undefined
              }
              className={`w-full rounded-xl border p-3 focus:outline-none focus:ring-2
                ${
                  errors.contactPerson
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
            />
            {errors.contactPerson && (
              <p
                id="contactPerson-error"
                role="alert"
                className="mt-1 text-sm md:text-[16px] lg:text-[18px] text-red-600"
              >
                {errors.contactPerson}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm md:text-[16px] lg:text-[18px] text-black"
            >
              Epost
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full rounded-xl border p-3 focus:outline-none focus:ring-2
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1 text-sm md:text-[16px] lg:text-[18px] text-red-600"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block mb-1 text-sm md:text-[16px] lg:text-[18px] text-black"
            >
              Meddelande
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              autoComplete="off"
              value={formData.message}
              onChange={handleChange}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full rounded-xl border p-3 focus:outline-none focus:ring-2
                ${
                  errors.message
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
            />
            {errors.message && (
              <p
                id="message-error"
                role="alert"
                className="mt-1 text-sm md:text-[16px] lg:text-[18px] text-red-600"
              >
                {errors.message}
              </p>
            )}
          </div>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full rounded-xl bg-[#1E5BCC] cursor-pointer py-3 text-white text-sm md:text-[16px] lg:text-[18px]
            hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Skickar..." : "Skicka"}
        </button>

        {isError && (
          <p
            id="form-error"
            role="alert"
            className="text-center text-red-600 text-sm md:text-[16px] lg:text-[18px]"
          >
            {message}
          </p>
        )}
      </form>

      {/* Modal */}
      {modalVisible && (
        <Modale
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
          onClose={() => setModalVisible(false)}
        >
          <div className="flex flex-col px-10 py-5 items-center w-80">
            <h2 id="success-title" className="text-xl font-crimsontext font-bold mb-2">
              {message || "Meddelande skickat!"}
            </h2>
            <button
              onClick={() => setModalVisible(false)}
              className="font-crimsontext mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer w-1/2"
            >
              Stäng
            </button>

          </div>
        </Modale>
      )}
    </section>
  );
};

export default ContactForm;
