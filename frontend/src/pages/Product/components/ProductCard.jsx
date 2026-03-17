import useAuth from "@/hooks/useAuth";
import { addToCart, removeOne } from "@/store/cart/shoppingCartSlice";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const ProductCard = ({ product, onOpen }) => {
  const { cart } = useSelector((state) => state.shoppingCart);
  const [priceType, setPriceType] = useState("unit");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Decide metric based on product type
  const weightMetric = product.type === "Oliveoil" ? "L" : "kg";

  // const cartItem = cart.find((item) => item.product._id === product._id);
  const cartItem = cart.find(
    (item) => item.product._id === product._id && item.priceType === priceType,
  );
  const quantity = cartItem?.quantity ?? 0;
  const displayPrice =
    priceType === "pallet"
      ? product.price.palletPrice
      : product.price.unitPrice;

  return (
    <article
      className="flex flex-col bg-white rounded-[50px] shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden text-black border border-[#1E5BCC] font-sans w-47.75 lg:w-65"
      aria-label={`Product: ${product.title} from ${product.brand}`}
      itemScope
      itemType="https://schema.org/Product"
    >
      <div
        className="text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BCC]"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        aria-label={`Öppna detaljer för ${product.title}`}
      >
        {/* Image */}
        <figure className="w-full h-40 lg:h-52 bg-white border-b border-black">
          <img
            src={product.image}
            alt={`${product.title} från ${product.brand}`}
            className="w-full h-full object-contain"
            itemProp="image"
          />
        </figure>

        {/* Brand */}
        <header>
          <p
            className="text-center pt-0.5 tracking-wide"
            aria-label={`Varumärke: ${product.brand}`}
            itemProp="brand"
          >
            {product.brand}
          </p>
        </header>
      </div>

      {/* Product detail */}
      <div className="flex flex-col flex-1 py-0.5 px-2 gap-1">
        {/* Title */}
        <h3
          className="text-sm lg:text-base font-semibold leading-tight line-clamp-2"
          id={`product-${product._id}-title`}
          itemProp="name"
        >
          {product.title}
        </h3>

        {/* Weight */}
        <p
          className="text-xs lg:text-sm text-[#696969]"
          aria-label={`Weight: ${product.weight} ${weightMetric}`}
        >
          {product.weight} {weightMetric}
        </p>

        {/* Price type selection */}
        <div
          className="flex justify-center gap-5 font-roboto md:text-base text-[12px]"
          role="group"
          aria-label="Välj pris typ"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPriceType("unit");
            }}
            aria-pressed={priceType === "unit"}
            className={`px-2 py-1 rounded-md border transition-colors duration-200 ${
              priceType === "unit"
                ? "bg-[#1E5BCC] text-white border-[#1E5BCC]"
                : "bg-white text-[#1E5BCC] border-[#1E5BCC] hover:bg-[#E0E7FF]"
            }`}
          >
            Styckpris
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPriceType("pallet");
            }}
            aria-pressed={priceType === "pallet"}
            className={`px-2 py-1 rounded-md border transition-colors duration-200 ${
              priceType === "pallet"
                ? "bg-[#1E5BCC] text-white border-[#1E5BCC]"
                : "bg-white text-[#1E5BCC] border-[#1E5BCC] hover:bg-[#E0E7FF]"
            }`}
          >
            Pallpris
          </button>
        </div>

        {/* Price */}
        <p
          className="text-base lg:text-lg font-bold"
          aria-label={`Price: ${displayPrice} kronor`}
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="SEK" />
          <span itemProp="price">{displayPrice}</span> kr
        </p>
      </div>

      {/* ADD TO CART */}
      <div
        className="self-center transition-all duration-200 ease-out text-sm md:text-base lg:text-lg"
        role="group"
        aria-label={`Köp ${product.title}`}
      >
        {quantity === 0 ? (
          <button
            type="button"
            aria-label={`Add ${product.title} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              if (isAuthenticated) {
                dispatch(addToCart({ product, priceType }));
              } else {
                navigate("/auth/logga-in"); // Redirect to login if not authenticated
              }
            }}
            className="
                  bg-[#1E5BCC] text-white rounded-full hover:bg-[#1747A3] px-3 py-1 transition-colors duration-200 flex items-center justify-center cursor-pointer mt-2 mb-2 w-[120.16px] md:w-[133.9px] lg:w-[147.64px] h-7 md:h-8 lg:h-9"
          >
            Lägg i varukorg
          </button>
        ) : (
          <div
            aria-live="polite"
            aria-atomic="true"
            role="group"
            aria-label={`Antal i varukorg för ${product.title}`}
            className="
                  flex items-center justify-center
                  gap-3 md:gap-5
                  bg-[#D9D9D9]
                  rounded-full
                  px-2 py-1 mt-2 mb-2 w-[120.16px] md:w-[133.9px] lg:w-[147.64px] h-7 md:h-8 lg:h-9
                "
          >
            <button
              type="button"
              aria-label={`Minska antal ${product.title}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isAuthenticated) {
                  dispatch(removeOne({ productId: product._id, priceType }));
                } else {
                  navigate("/auth/logga-in"); // Redirect to login if not authenticated
                }
              }}
              className="w-5 h-5 rounded-full bg-[#1E5BCC] text-white flex items-center justify-center"
            >
              <FaMinus size={11} aria-hidden="true" />
            </button>

            <span
              aria-label={`Antal: ${quantity}`}
              className="
                    w-10 md:w-12 h-5
                    flex items-center justify-center
                    font-quattrocento font-bold
                    bg-[#1E5BCC] text-white
                    rounded-full
                    tabular-nums
                  "
            >
              {quantity}
            </span>

            <button
              type="button"
              aria-label={`Öka antal ${product.title}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isAuthenticated) {
                  dispatch(addToCart({ product, priceType }));
                } else {
                  navigate("/auth/logga-in"); // Redirect to login if not authenticated
                }
              }}
              className="w-5 h-5 rounded-full bg-[#1E5BCC] text-white flex items-center justify-center"
            >
              <FaPlus size={11} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
export default ProductCard;
