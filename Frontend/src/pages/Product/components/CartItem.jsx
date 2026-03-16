import { useDispatch } from "react-redux";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import {
  addToCart,
  removeItem,
  removeOne,
} from "@/store/cart/shoppingCartSlice";
import { useLocation } from "react-router";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location
  const isCheckout = location.pathname.includes("kassa");
  const weightMetric = item.product.type === "Oliveoil" ? "L" : "kg";
  const priceType = item.priceType;

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      aria-label={`Produkt i varukorg: ${item.product.title}`}
      role="group"
    >
      {!isCheckout ? (
        <div className="flex justify-between items-center border rounded p-2">
          <div className="flex items-center gap-3">
            <img
              src={item.product.image}
              itemProp="image"
              loading="lazy"
              decoding="async"
              alt={`Produktbild av ${item.product.title}`}
              className="w-14 h-14 object-contain rounded"
            />

            <div>
              <h3 itemProp="name" id={`cart-item-${item.product._id}`}>
                {item.product.title}
              </h3>
              <p className="text-sm text-gray-500">
                {item.quantity} × {item.price} kr
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                dispatch(removeOne({ productId: item.product._id, priceType }))
              }
              className="p-1 border rounded hover:bg-gray-100 cursor-pointer"
              aria-label={`Minska antal av ${item.product.title}`}
              title="Minska antal"
              type="button"
              aria-controls={`quantity-${item.product._id}`}
            >
              <FaMinus className="text-xs" aria-hidden="true" />
            </button>

            <button
              onClick={() =>
                dispatch(addToCart({ product: item.product, priceType }))
              }
              className="p-1 border rounded hover:bg-gray-100 cursor-pointer"
              aria-controls={`quantity-${item.product._id}`}
              aria-label={`Öka antal av ${item.product.title}`}
              title="Öka antal"
              type="button"
            >
              <FaPlus className="text-xs" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                dispatch(removeItem({ productId: item.product._id, priceType }))
              }
              className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
              aria-label={`Ta bort ${item.product.title} från varukorgen`}
              title="Ta bort produkt"
            >
              <FaTrash aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex border border-[#1E5BCC] items-stretch text-sm font-crimsontext lg:text-base">
          {/* Image */}
          <div className="flex items-center justify-center flex-[0_0_60px] md:flex-[0_0_80px] p-1 md:p-2">
            <img
              src={item.product.image}
              alt={`Produktbild av ${item.product.title}`}
              className="max-h-20 object-contain"
              itemProp="image"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col justify-center gap-1 p-1 md:px-2 flex-1 border-l border-black">
            <span
              className="break-all font-bold"
              itemProp="brand"
              itemScope
              itemType="https://schema.org/Brand"
            >
              <span itemProp="name">{item.product.brand}</span>
            </span>
            <p className="break-all font-bold" itemProp="name">
              {item.product.title}
            </p>
            <p className="text-gray-500">
              {item.product.weight} {weightMetric}
            </p>
          </div>

          {/* Price (desktop only) */}
          <div
            className="hidden md:flex flex-col items-center flex-[0_0_120px] border-l border-black"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <meta itemProp="priceCurrency" content="SEK" />
            <p
              className="bg-gray-100 w-full text-center py-1 font-bold"
              aria-label="ordinarie pris"
            >
              ORD.PRIS
            </p>
            <p className="mt-6 font-bold text-[#1E5BCC]">
              <span itemProp="price">{item.price} kr</span>
            </p>
          </div>

          {/* Quantity */}
          <div className="hidden md:flex flex-col items-center flex-[0_0_120px] border-l border-black">
            <p
              className="bg-gray-100 w-full text-center py-1 font-bold"
              aria-label="Antal"
            >
              Antal
            </p>
            <div>
              <div>
                {priceType == "pallet" ? <span>Pall</span> : <span>Styck</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center mt-5 bg-[#D9D9D9] p-1 rounded-full">
              <button
                className="cursor-pointer w-5 h-5 rounded-full bg-[#1E5BCC] text-white flex items-center justify-center"
                aria-label={`Minska antal av ${item.product.title}`}
                title="Minska antal"
                onClick={() =>
                  dispatch(
                    removeOne({ productId: item.product._id, priceType }),
                  )
                }
                type="button"
                aria-controls={`quantity-${item.product._id}`}
              >
                <FaMinus aria-hidden="true" />
              </button>
              <span
                className="w-10 md:w-12 h-5
                    flex items-center justify-center
                    font-quattrocento font-bold
                    bg-[#1E5BCC] text-white
                    rounded-full
                    tabular-nums"
                aria-live="polite"
                role="status"
                aria-atomic="true"
                id={`quantity-${item.product._id}`}
              >
                {item.quantity}
              </span>
              <button
                className="cursor-pointer w-5 h-5 rounded-full bg-[#1E5BCC] text-white flex items-center justify-center"
                aria-controls={`quantity-${item.product._id}`}
                aria-label={`Öka antal av ${item.product.title}`}
                title="Öka antal"
                onClick={() =>
                  dispatch(addToCart({ product: item.product, priceType }))
                }
                type="button"
              >
                <FaPlus aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Sum */}
          <div className="flex flex-col items-center flex-[0_0_120px] border-l border-black">
            <p className="bg-gray-100 w-full text-center py-1 font-bold">
              Summa
            </p>
            <p className="mt-2 text-[#1E5BCC] font-bold md:mt-6">
              {item.price * item.quantity} kr
            </p>
            <div className="md:hidden">
              {priceType == "pallet" ? <span>Pall</span> : <span>Styck</span>}
            </div>
            <div
              className="md:hidden flex items-center gap-2 justify-center
                  bg-[#D9D9D9]
                  rounded-full p-1 mt-2"
            >
              <button
                onClick={() =>
                  dispatch(
                    removeOne({ productId: item.product._id, priceType }),
                  )
                }
                className="w-5 h-5 rounded-full bg-[#1E5BCC] text-white flex items-center justify-center"
                aria-label={`Minska antal av ${item.product.title}`}
                aria-controls={`quantity-${item.product._id}`}
                title="Minska antal"
                type="button"
              >
                <FaMinus className="text-xs" aria-hidden="true" />
              </button>

              <span
                className="w-10 md:w-12 h-5
                    flex items-center justify-center
                    font-quattrocento font-bold
                    bg-[#1E5BCC] text-white
                    rounded-full
                    tabular-nums"
                aria-live="polite"
                role="status"
                aria-atomic="true"
                id={`quantity-${item.product._id}`}
              >
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  dispatch(addToCart({ product: item.product, priceType }))
                }
                className="w-5 h-5 rounded-full bg-[#1E5BCC] text-white flex items-center justify-center"
                aria-controls={`quantity-${item.product._id}`}
                aria-label={`Öka antal av ${item.product.title}`}
                title="Öka antal"
                type="button"
              >
                <FaPlus className="text-xs" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Trash */}
          <div className="flex items-center justify-center flex-[0_0_40px] md:flex-[0_0_50px] border-l border-black">
            <button
              className="cursor-pointer text-red-500 hover:text-red-700"
              aria-label={`Ta bort ${item.product.title} från varukorgen`}
              aria-describedby={`cart-item-${item.product._id}-title`}
              title="Ta bort produkt"
              onClick={() =>
                dispatch(removeItem({ productId: item.product._id, priceType }))
              }
              type="button"
            >
              <FaTrash size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
export default CartItem;
