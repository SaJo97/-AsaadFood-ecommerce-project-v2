import { deleteProduct } from "@/store/products/productSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const ProductCardAdmin = ({ product, onOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      // console.log("deleted success");
    } catch (error) {
      console.error("error deleting", error);
      navigate("/");
    }
  };
  // Decide metric based on product type
  const weightMetric = product.type === "Oliveoil" ? "L" : "kg";

  return (
    <article
      className="flex flex-col bg-white rounded-[50px] shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden text-black border border-[#1E5BCC] font-sans w-47.75 lg:w-65"
      aria-label={`Product: ${product.title} from ${product.brand}`}
      itemScope
      itemType="https://schema.org/Product"
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

      {/* Product detail */}
      <div className="flex flex-col flex-1 py-0.5 px-2 gap-1">
        {/* Title */}
        <h3
          className="text-sm lg:text-base font-semibold leading-tight line-clamp-2"
          aria-label={`Product name: ${product.title}`}
          id={`product-${product._id}-title`}
          itemProp="name"
        >
          {product.title}
        </h3>

        {/* Weight */}
        <p
          className="text-xs lg:text-sm text-[#696969]"
          aria-label={`Weight: ${product.weight} ${weightMetric}`}
          itemProp="weight"
        >
          {product.weight} {weightMetric}
        </p>

        {/* Price */}
        <div
          className="text-base lg:text-lg font-bold"
          aria-label={`Price: ${product.unitPrice ?? product.price?.unitPrice ?? 0} kronor`}
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <span itemProp="priceCurrency" content="SEK" />
          <div className="flex flex-col" itemProp="price">
            <span>Styckpris: {product.price?.unitPrice} kr</span>
            <span>Pallpris: {product.price?.palletPrice} kr</span>
          </div>
        </div>
      </div>

      <div
        className="self-center transition-all duration-200 ease-out text-sm md:text-base lg:text-lg"
        role="group"
        aria-label={`Administrativa åtgärder för produkten ${product.title}`}
      >
        <div className="flex items-center justify-center gap-3 md:gap-4 rounded-full px-2 py-1 mt-2 mb-2">
          <button
            type="button"
            onClick={handleDelete}
            className="
                    bg-[#1E5BCC] text-white rounded-full hover:bg-[#1747A3] px-2 py-1 transition-colors duration-200 flex items-center justify-center cursor-pointer min-w-15 md:min-w-17.5 lg:min-w-20"
            aria-label={`Ta bort produkten ${product.title}`}
          >
            Ta bort
          </button>
          <button
            type="button"
            onClick={onOpen}
            className="
                    bg-[#1E5BCC] text-white rounded-full hover:bg-[#1747A3] px-2 py-1 transition-colors duration-200 flex items-center justify-center cursor-pointer min-w-15 md:min-w-17.5 lg:min-w-20"
            aria-label={`Ändra produkten ${product.title}`}
          >
            Ändra
          </button>
        </div>
      </div>
    </article>
  );
};
export default ProductCardAdmin;
