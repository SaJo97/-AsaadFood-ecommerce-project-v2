import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"

const Modale = ({onClose, children}) => {
  const modalRef = useRef(null);

  // Focus management (critical for INP + accessibility)
  useEffect(() => {
    const previouslyFocused = document.activeElement;

    const focusable = modalRef.current?.querySelector(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    // Prevent background scroll
    document.body.style.overflow = "hidden";

    // ESC key close
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative z-10  max-w-220 bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-2 top-0 text-3xl text-black cursor-pointer"
        >
          &times;
        </button>

        {children}
      </div>
    </div>,
    document.getElementById("message-modal")
  );
}
export default Modale