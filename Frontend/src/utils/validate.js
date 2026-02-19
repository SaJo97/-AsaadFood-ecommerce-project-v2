import { isValidOrgNumber } from "./orgValidate.js";

// Regex patterns
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{6,}$/;

const phoneRegex = /^(?:\+46|0046|0)7[02369]\d{7}$/;
const postalCodeRegex = /^\d{3}\s?\d{2}$/;
const cityRegex = /^[A-Za-zÅÄÖåäö\s-]+$/;

export const validate = (form, fields = null) => {
  const shouldValidate = (field) => {
    if (!fields) return true;
    if (!Array.isArray(fields)) return true;
    return fields.includes(field);
  };

  const err = {};
  let isValid = true;

  const isEmpty = (v) => !v || v.trim() === "";

  /* -------------------- EMAILS -------------------- */

  if (shouldValidate("loginEmail")) {
    if (isEmpty(form.loginEmail)) {
      err.loginEmail = "E-postadress krävs";
      isValid = false;
    } else if (!emailRegex.test(form.loginEmail.toLowerCase())) {
      err.loginEmail = "Ogiltig e-postadress";
      isValid = false;
    }
  }

  if (shouldValidate("invoiceEmail")) {
    if (isEmpty(form.invoiceEmail)) {
      err.invoiceEmail = "Faktura-e-post krävs";
      isValid = false;
    } else if (!emailRegex.test(form.invoiceEmail.toLowerCase())) {
      err.invoiceEmail = "Ogiltig e-postadress";
      isValid = false;
    }
  }

  /* -------------------- PASSWORD -------------------- */

  if (shouldValidate("password")) {
    if (isEmpty(form.password)) {
      err.password = "Lösenord krävs";
      isValid = false;
    } else if (!passwordRegex.test(form.password)) {
      err.password = "Minst 6 tecken, versal, gemen, siffra och specialtecken";
      isValid = false;
    }
  }

  if (shouldValidate("password") || shouldValidate("confirmPassword")) {
    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Lösenorden matchar inte";
      isValid = false;
    }
  }

  /* -------------------- CONTACT PERSON -------------------- */

  if (shouldValidate("firstName")) {
    if (isEmpty(form.firstName)) {
      err.firstName = "Förnamn krävs";
      isValid = false;
    }
  }

  if (shouldValidate("lastName")) {
    if (isEmpty(form.lastName)) {
      err.lastName = "Efternamn krävs";
      isValid = false;
    }
  }

  if (shouldValidate("phone")) {
    if (isEmpty(form.phone)) {
      err.phone = "Telefonnummer krävs";
      isValid = false;
    } else if (!phoneRegex.test(form.phone.replace(/\s|-/g, ""))) {
      err.phone = "Ogiltigt telefonnummer";
      isValid = false;
    }
  }

  /* -------------------- COMPANY -------------------- */

  if (shouldValidate("companyName")) {
    if (isEmpty(form.companyName)) {
      err.companyName = "Företagsnamn krävs";
      isValid = false;
    }
  }

  if (shouldValidate("orgNumber")) {
    if (isEmpty(form.orgNumber)) {
      err.orgNumber = "Organisationsnummer krävs";
      isValid = false;
    } else if (!isValidOrgNumber(form.orgNumber)) {
      err.orgNumber = "Ogiltigt organisationsnummer";
      isValid = false;
    }
  }

  if (shouldValidate("streetAddress")) {
    if (isEmpty(form.streetAddress)) {
      err.streetAddress = "Gatuadress krävs";
      isValid = false;
    }
  }

  if (shouldValidate("postalCode")) {
    if (isEmpty(form.postalCode)) {
      err.postalCode = "Postnummer krävs";
      isValid = false;
    } else if (!postalCodeRegex.test(form.postalCode)) {
      err.postalCode = "Ogiltigt postnummer";
      isValid = false;
    }
  }

  if (shouldValidate("city")) {
    if (isEmpty(form.city)) {
      err.city = "Ort krävs";
      isValid = false;
    } else if (!cityRegex.test(form.city)) {
      err.city = "Ogiltig ort";
      isValid = false;
    }
  }

  /* -------------------- FINAL -------------------- */

  // setErrors(err);
  // return isValid;
  return { isValid, errors: err };
};

// FIXA SENARE
// import { isValidOrgNumber } from "@/shared/validators/orgNumber";

// if (!isValidOrgNumber(formData.orgNumber)) {
//   setErrors((prev) => ({
//     ...prev,
//     orgNumber: "Ogiltigt organisationsnummer",
//   }));
// }
