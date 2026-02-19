import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import CartItem from "./CartItem";
import { useState } from "react";
import Modale from "@/components/Modale";
import { createOrder } from "@/store/order/orderSlice";
import { clearCart } from "@/store/cart/shoppingCartSlice";

const ShoppingCart = ({ setIsOpen, isCheckoutPage }) => {
  const { cart, totalPrice, totalQuantity } = useSelector(
    (state) => state.shoppingCart,
  );
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location
  const isCheckout = location.pathname.includes("kassa"); 

  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      setModalMessage(
        "Din varukorg är tom. Vänligen lägg till varor innan du gör en beställning.",
      );
      setShowModal(true);
      return;
    }
    // Construct the order data from the cart items
    const orderData = {
      products: cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
    };

    // Dispatch the createOrder action
    dispatch(createOrder(orderData))
      .unwrap() // Unwrap the promise to handle success/error
      .then((data) => {
        // console.log("Order created successfully:", data);
        dispatch(clearCart()); // Clear the cart after successful order
        setModalMessage("Beställning skapades!");
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Failed to create order:", error);
        setModalMessage(
          "Misslyckades med att skapa beställningen. Försök igen",
        );
        setShowModal(true);
      });
  };

  return (
    <aside
      className="w-full w-max-225 bg-white shadow-lg rounded-lg p-3 md:p-4"
      aria-labelledby="cart-heading"
    >
      <header>
        <h1
          className={
            isCheckout
              ? "font-quattrocento text-lg mb-3"
              : "text-lg font-semibold mb-3"
          }
          id="cart-heading"
        >
          Varukorg {isCheckout ? `(${totalQuantity} varor)` : ""}
        </h1>
      </header>

      {cart.length === 0 && (
        <p
          className="text-center text-gray-500 py-6"
          role="status"
          aria-live="polite"
        >
          Din varukorg är tom
        </p>
      )}

      {cart.length > 0 && (
        <ul
          className={isCheckout ? "flex flex-col md:gap-6 gap-3" : "space-y-3"}
          aria-label="Produkter i varukorgen"
        >
          {cart.map((item) => (
            <li key={item.product._id}>
              <CartItem item={item} />
            </li>
          ))}
        </ul>
      )}

      <section
        className={
          isCheckout
            ? "flex flex-col gap-5 items-end pt-4 font-quattrocento"
            : "flex  items-center gap-1 pt-4 flex-col"
        }
        aria-labelledby="cart-summary"
      >
        <h3 id="cart-summary" className="sr-only">
          Sammanfattning
        </h3>

        <dl
          className={
            isCheckout
              ? "md:w-1/3 w-full flex flex-col border border-black"
              : ""
          }
        >
          <div
            className={
              isCheckout
                ? "flex justify-between border-b border-black p-2"
                : "flex gap-2"
            }
          >
            <dt>{isCheckout ? "Total varukostnad:" : "Total:"} </dt>
            <dd>{totalPrice} kr</dd>
          </div>
          <div
            className={
              isCheckout
                ? "flex justify-between border-b border-black p-2"
                : "hidden"
            }
          >
            <dt>Andra kostnader: </dt>
            <dd>xxx kr</dd>
          </div>
          <div
            className={
              isCheckout ? "flex justify-between border-black p-2" : "hidden"
            }
          >
            <dt>Totalbelopp: </dt>
            <dd>xxx kr</dd>
          </div>
        </dl>

        {isCheckoutPage ? (
          <button
            onClick={handlePlaceOrder}
            className="px-4 py-2 bg-[#1E5BCC] text-white rounded-full md:w-1/3 w-full hover:bg-[#256ff8] disabled:opacity-50 cursor-pointer"
            type="button"
            disabled={cart.length === 0}
            aria-disabled={cart.length === 0}
          >
            Beställ
          </button>
        ) : (
          <Link
            to="/kassa"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-[#1E5BCC] text-white rounded-full w-full text-center hover:bg-[#256ff8]"
            aria-label="Gå till kassan"
          >
            Gå till kassan
          </Link>
        )}
      </section>

      {showModal && (
        <Modale onClose={() => setShowModal(false)}>
          <div
            className="p-6 text-center"
            role="alertdialog"
            aria-labelledby="modal-title"
            aria-live="assertive"
          >
            <h2 id="modal-title" className="text-lg font-semibold mb-3">
              Meddelande
            </h2>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-[#1E5BCC] text-white rounded-full hover:bg-[#1747A3]"
            >
              Stäng
            </button>
          </div>
        </Modale>
      )}
    </aside>
  );
};
export default ShoppingCart;
