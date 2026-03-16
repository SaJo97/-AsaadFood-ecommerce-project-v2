import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/store/products/productSlice";
import { useState } from "react";
import { useNavigate } from "react-router";
const ProductUpdateAdmin = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.productList);

  const [formData, setFormData] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    type: product?.type || "",
    weight: product?.weight || "",
    price: product?.price || "",
    image: product?.image || "",
    description: product?.description || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "weight" || name === "unitPrice" || name === "palletPrice"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      ...formData,
      price: {
        unitPrice: formData.unitPrice,
        palletPrice: formData.palletPrice,
      },
      _id: product._id,
    };
    try {
      await dispatch(updateProduct(updatedProduct)).unwrap();
      onClose();
      // console.log(formData);
    } catch (error) {
      console.error("Update failed:", error);
      navigate("/");
    }
  };
  return (
    <div
      className="w-full max-w-225 mx-auto flex flex-col gap-2 p-3 font-raleway lg:text-[17px] max-h-[90vh] overflow-y-auto"
      aria-labelledby={`product-${product._id}-title`}
      itemScope
      itemType="https://schema.org/Product"
    >
      <header>
        <h1
          id={`product-${product._id}-title`}
          itemProp="name"
          className="text-center font-crimsontext font-bold text-2xl"
        >
          Uppdatera produkt
        </h1>
      </header>

      {/* Form product section */}
      <section
        className="rounden-lg rounded-2xl bg-[#f9f9f9] border"
        aria-label={`Uppdatera produkt: ${product.title}`}
      >
        {/* Product info */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-4 gap-3 w-full"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-semibold mb-1">
              Titel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
              required
              aria-label="Produkttitel"
            />
          </div>

          {/* Typ + Brand*/}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block font-semibold mb-1">
                Typ
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
                aria-label="Produkttyp"
              >
                <option value="">Välj typ</option>
                <option value="Rice">Ris</option>
                <option value="Oliveoil">Olivolja</option>
              </select>
            </div>
            <div>
              <label htmlFor="brand" className="block font-semibold mb-1">
                Märke
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
                aria-label="Produktmärke"
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block font-semibold mb-1">
              Vikt (kg/L)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              placeholder="kg/L"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
              required
              aria-label="Produktvikt"
            />
          </div>

          {/*Unit Price + Pallet Price */}
          <div className="grid grid-cols-2 gap-4 ">
            <div>
              <label htmlFor="unitPrice" className="block font-semibold mb-1">
                Styckpris (kr)
              </label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                placeholder="Styckpris"
                value={formData.unitPrice ?? formData.price?.unitPrice ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
                aria-label="Styckpris"
              />
            </div>

            <div>
              <label htmlFor="palletPrice" className="block font-semibold mb-1">
                Pallpris (kr)
              </label>
              <input
                type="number"
                id="palletPrice"
                name="palletPrice"
                placeholder="Pallpris"
                value={
                  formData.palletPrice ?? formData.price?.palletPrice ?? ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
                aria-label="Pallpris"
              />
            </div>
          </div>
          {/* Product Image */}
          <div>
            <label htmlFor="image" className="block font-semibold mb-1">
              Bild (URL)
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
              required
              aria-label="Produktbild URL"
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-semibold mb-1">
              Produktinformation
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none min-h-35"
              required
              aria-label="Produktbeskrivning"
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-[#1E5BCC] text-white rounded-md hover:bg-[#1747A3] px-2 py-1 transition-colors duration-150 flex items-center justify-center cursor-pointer min-w-15 md:min-w-17.5 lg:min-w-20 w-full border border-black"
              onClick={onClose}
              aria-label="Avbryt uppdatering av produkt"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading?.update}
              className="bg-[#1E5BCC] text-white rounded-md hover:bg-[#1747A3] px-2 py-1 transition-colors duration-150 flex items-center justify-center cursor-pointer min-w-15 md:min-w-17.5 lg:min-w-20 w-full border border-black"
              aria-label="Spara uppdateringar av produkt"
            >
              {loading?.update ? "Sparar..." : "Spara"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
export default ProductUpdateAdmin;
