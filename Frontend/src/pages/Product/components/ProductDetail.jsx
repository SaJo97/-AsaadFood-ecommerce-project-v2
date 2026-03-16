import { addToCart, removeOne } from "@/store/cart/shoppingCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
const ProductDetail = ({ product, onClose }) => {
  const { cart } = useSelector((state) => state.shoppingCart);
  const [priceType, setPriceType] = useState("unit");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const weightMetric = product.type === "Oliveoil" ? "L" : "kg";

  const cartItem = cart.find(
    (item) => item.product._id === product._id && item.priceType === priceType,
  );
  const quantity = cartItem?.quantity ?? 0;
  const displayPrice =
    priceType === "pallet"
      ? product.price.palletPrice
      : product.price.unitPrice;

  const boxesPerPallet = product.packaging.boxesPerPallet ?? 0;
  const weight = product.weight ?? 0;
  const unitsPerBox = Math.floor(product.packaging.maxBoxWeight / weight);

  const unitsPerPallet = unitsPerBox * boxesPerPallet;
  const boxWeight = weight * unitsPerBox;
  const palletWeight = boxWeight * boxesPerPallet;
  const palletpriceunit = Math.floor(
    product.price.palletPrice / unitsPerPallet,
  );

  return (
    <div
      className="w-full max-w-200 min-h-155 mx-auto flex flex-col" // min-h-155 kanske ta bort
      aria-labelledby="product-title"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Main product section */}
      <section className="flex border-b border-[#1E5BCC]">
        {/* Product Image */}
        <figure
          className="flex md:w-95.75 self-center"
          aria-label={`Bild på ${product.title}`}
        >
          <img
            src={product.image}
            alt={`${product.title} from ${product.brand}`}
            className="max-h-70 w-full object-contain"
            itemProp="image"
          />
        </figure>

        {/* Product info */}
        <div className="flex flex-col p-4 justify-between flex-1 border-l border-[#1E5BCC] ">
          <header className="flex flex-col gap-5 py-5 font-crimsontext font-bold text-sm md:text-xl lg:text-[24px]">
            {/* Brand */}
            <p
              className="tracking-wide"
              itemProp="brand"
              aria-label={`Varumärke: ${product.brand}`}
            >
              {product.brand}
            </p>

            {/* Title */}
            <h3
              className="leading-tight line-clamp-2"
              aria-label={`Produktnamn: ${product.title}`}
              id="product-title"
              itemProp="name"
            >
              {product.title}
            </h3>

            {/* Weight */}
            <p aria-label={`Vikt: ${product.weight} ${weightMetric}`}>
              <span className="sr-only">Vikt:</span>
              {product.weight} {weightMetric}
            </p>

            <div
              className="flex gap-5 font-roboto md:text-base text-[12px]"
              role="group"
              aria-label="Välj pris typ"
            >
              <button
                type="button"
                aria-pressed={priceType === "unit"}
                onClick={(e) => {
                  e.stopPropagation();
                  setPriceType("unit");
                }}
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
                aria-pressed={priceType === "pallet"}
                onClick={(e) => {
                  e.stopPropagation();
                  setPriceType("pallet");
                }}
                className={`px-2 py-1 rounded-md border transition-colors duration-200 ${
                  priceType === "pallet"
                    ? "bg-[#1E5BCC] text-white border-[#1E5BCC]"
                    : "bg-white text-[#1E5BCC] border-[#1E5BCC] hover:bg-[#E0E7FF]"
                }`}
              >
                Pallpris
              </button>
            </div>
            {/* Packaging Info */}
            <div className="flex gap-2 text-sm md:text-base flex-col">
              <div className="flex flex-col md:flex-row gap-2">
                <p>
                  <span className="sr-only">En kartong innehåller: </span>1
                  kartong: {unitsPerBox} st ({boxWeight}
                  {weightMetric})
                </p>
                <p>
                  <span className="sr-only">Antal kartonger per pall: </span>1
                  pall: {boxesPerPallet} kartonger
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <p>
                  <span className="sr-only">
                    Totalt antal enheter per pall:{" "}
                  </span>
                  Totalt per pall: {unitsPerPallet} st ({palletWeight}
                  {weightMetric})
                </p>
                <p>
                  <span className="sr-only">
                    Styckpris baserat på pallpris:{" "}
                  </span>
                  Pallpris - styck: {palletpriceunit} kr
                </p>
              </div>
            </div>

            {/* Price */}
            <p
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
              aria-label={`Pris: ${displayPrice} kronor`}
            >
              <span className="sr-only">Pris:</span>
              <span itemProp="priceCurrency" content="SEK" />
              <span itemProp="price">{displayPrice}</span> kr
            </p>
          </header>

          {/* Cart controls */}
          <div
            className="self-center transition-all duration-200 ease-out"
            role="group"
            aria-label="Produkt i varukorg"
          >
            {/* Add to cart */}
            {quantity === 0 ? (
              <button
                type="button"
                aria-label={`Lägg ${product.title} i varukorgen`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isAuthenticated) {
                    dispatch(addToCart({ product, priceType })); // Only add if authenticated
                  } else {
                    navigate("/auth/logga-in"); // Redirect to login if not authenticated
                  }
                }}
                className="bg-[#1E5BCC] text-white px-4 py-2 rounded-full
                         hover:bg-[#1747A3] transition-colors text-sm md:text-xl cursor-pointer flex items-center justify-center md:w-[169.38px] md:h-11 w-[128.19px] h-9"
              >
                Lägg i varukorg
              </button>
            ) : (
              <div
                className="flex items-center justify-center gap-3 md:gap-5 px-3 bg-[#D9D9D9] rounded-full md:w-[169.38px] md:h-11 w-[128.19px] h-9"
                role="group"
                aria-label={`Antal i varukorgen för ${product.title}`}
                aria-live="polite"
                aria-atomic="true"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      dispatch(
                        removeOne({ productId: product._id, priceType }),
                      );
                    } else {
                      navigate("/auth/logga-in"); // Redirect to login if not authenticated
                    }
                  }}
                  className="w-6 h-6 rounded-full bg-[#1E5BCC] cursor-pointer text-white transition-all duration-200 ease-out flex items-center justify-center"
                  aria-label={`Minska antal ${product.title} i varukorgen`}
                >
                  <FaMinus size={12} aria-hidden="true" />
                </button>

                <span
                  className="flex items-center justify-center font-quattrocento font-bold bg-[#1E5BCC] text-white w-10 md:w-12 h-6 rounded-full tabular-nums"
                  aria-label={`Antal i varukorg: ${quantity}`}
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label={`Öka antal ${product.title} i varukorgen`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      dispatch(addToCart({ product, priceType }));
                    } else {
                      navigate("/auth/logga-in"); // Redirect to login if not authenticated
                    }
                  }}
                  className="w-6 h-6 rounded-full bg-[#1E5BCC] cursor-pointer text-white flex items-center justify-center transition-all duration-200 ease-out"
                >
                  <FaPlus size={12} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      <section
        className="p-5 flex flex-col items-center gap-5"
        aria-labelledby="product-description-heading"
      >
        <h2
          className="text-base md:text-lg font-cinzel font-bold"
          id="product-description-heading"
        >
          Produktinformation
        </h2>
        <p
          className="text-sm md:text-base font-sans leading-relaxed"
          itemProp="description"
        >
          {product.description}
        </p>
      </section>
    </div>
  );
};
export default ProductDetail;
