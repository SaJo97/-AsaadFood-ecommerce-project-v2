import { addToCart, removeOne } from "@/store/cart/shoppingCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
const ProductDetail = ({ product, onClose }) => {
  const { cart } = useSelector((state) => state.shoppingCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const weightMetric = product.type === "Oliveoil" ? "L" : "kg";

  const cartItem = cart.find((item) => item.product._id === product._id);
  const quantity = cartItem?.quantity ?? 0;

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
        <figure className="flex md:w-95.75 self-center">
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
              aria-label={`Brand: ${product.brand}`}
            >
              {product.brand}
            </p>

            {/* Title */}
            <h3
              className="leading-tight line-clamp-2"
              aria-label={`Product name: ${product.title}`}
              id="product-title"
              itemProp="name"
            >
              {product.title}
            </h3>

            {/* Weight */}
            <p aria-label={`Weight: ${product.weight} ${weightMetric}`}>
              <span className="sr-only">Vikt:</span>
              {product.weight} {weightMetric}
            </p>

            {/* Price */}
            <p
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
              aria-label={`Price: ${product.price} kronor`}
            >
              <span className="sr-only">Pris:</span>
              <span itemProp="priceCurrency" content="SEK" />
              <span itemProp="price">{product.price}</span> kr
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
                    dispatch(addToCart(product)); // Only add if authenticated
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
                aria-live="polite"
                aria-atomic="true"
              >
                <button
                  // onClick={() => dispatch(removeOne(product._id))}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      dispatch(removeOne(product._id));
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
                  // onClick={() => dispatch(addToCart(product))}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAuthenticated) {
                      dispatch(addToCart(product));
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
