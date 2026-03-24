export const isValidOrgNumber = (value) => {
  if (!value) return false;

  // Remove dash: XXXXXX-XXXX → XXXXXXXXXX
  const digits = value.replace("-", "");

  if (!/^\d{10}$/.test(digits)) {
    throw new Error("Organisationsnummer måste bestå av 10 siffror");
  }

  let sum = 0;
  let shouldDouble = true;

  for (let i = digits.length - 2; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checksum = (10 - (sum % 10)) % 10;

  if (checksum !== Number(digits[9])) {
    throw new Error("Ogiltigt organisationsnummer");
  }

  return true;
};

