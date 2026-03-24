const FormInput = ({
  className,
  errorMsg,
  label,
  icon: Icon,
  name,
  id,
  type = "text",
  required = false,
  ...rest
}) => {
  // Generate a unique id for aria-describedby if there's an error
  const errorId = errorMsg ? `${id}-error` : undefined;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className={Icon ? "flex items-center gap-2" : ""}>
        {Icon && <Icon aria-hidden="true" focusable="false" />}
        {label}
        {required}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={errorMsg ? "true" : "false"}
        aria-describedby={errorId}
        required={required}
        {...rest}
        className={`border-2 p-2 rounded focus:outline-none focus:ring ${
          errorMsg
            ? "border-[#D12323] focus:ring-[#D12323]"
            : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {errorMsg && (
        <p
          className="text-[#D12323]"
          id={errorId}
          role="alert"
          aria-live="assertive"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
};
export default FormInput;
