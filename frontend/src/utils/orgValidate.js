export const isValidOrgNumber = (value) => {
  if (!value) return false;

  const digits = value.replace("-", "");

  if (!/^\d{10}$/.test(digits)) return false;

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

  return (10 - (sum % 10)) % 10 === Number(digits[9]);
};
