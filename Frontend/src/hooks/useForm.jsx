import { validate } from "@/utils/validate.js";
import { useState } from "react";

const useForm = (initialFormData) => {
  const [form, setForm] = useState({ ...initialFormData });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((data) => ({
      ...data,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (e, fields = null) => {
    if (e) e.preventDefault();

    // const isValid = validate(form, setErrors, fields);
    const { isValid, errors: validationErrors } = validate(form, fields);

    setErrors(validationErrors);

    if (!isValid) {
      return { success: false, errors: validationErrors }; //errors
    }
    return { success: true, form };
  };

  const handleBlur = (e) => {
    const fieldName = e.target.name;
    const { errors: validationErrors } = validate(form, [fieldName]);
    setErrors((prev) => ({
      ...prev,
      ...validationErrors,
    }));
  };

  return {
    form,
    setForm,
    errors,
    handleChange,
    handleSubmit,
    handleBlur,
  };
};
export default useForm;
