import ShoppingCart from "@/pages/Product/components/ShoppingCart"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"

const Dropdown = ({children}) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonId = useId();
  const panelId = useId();
  const buttonRef = useRef(null);
  const rootRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  return (
    <div ref={rootRef}>
      {/* Render the background overlay if the dropdown is open */}
      {isOpen && <DropdownBg onClose={() => setIsOpen(false)} />}

      {/* Button to toggle the dropdown visibility */}
      <button onClick={() => setIsOpen((open) => !open)} ref={buttonRef} id={buttonId} type="button" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls={panelId} aria-label="Öppna varukorg">
        {children} {/* Display the button's children (text or icon) */}
      </button>

      {/* Render the dropdown content if it is open */}
      {isOpen && (
        <div id={panelId} role="dialog" aria-modal="false" aria-labelledby={buttonId} aria-describedby="cart-description" className="absolute w-[320px] right-0 z-10 mt-1 rounded-2xl shadow-2xl">
          <p id="cart-description" className="sr-only">
            Varukorg med valda produkter. Stäng genom att klicka utanför eller
            tryck Escape.
          </p>
          <div className="pt-1">
            {/* Render the ShoppingCart component and pass setIsOpen to it */}
            <ShoppingCart setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
export default Dropdown

const DropdownBg = ({ onClose }) => {
  return createPortal(
    <div
      onClick={onClose}
      aria-hidden="true"
    />,
    document.querySelector("#modal")
  );
};