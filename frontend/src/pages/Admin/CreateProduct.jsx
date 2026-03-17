import { createProduct } from "@/store/products/productSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [] } = useSelector((state) => state.productList);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    weight: "",
    unitPrice: "",
    palletPrice: "",
    image: "",
    description: "",
    type: "",
  });

  const handleChange = (e) => {
    setFormData((state) => ({
      ...state,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.title.trim() === "" ||
      formData.brand.trim() === "" ||
      formData.weight.trim() === "" ||
      formData.unitPrice.trim() === "" ||
      formData.palletPrice.trim() === "" ||
      formData.image.trim() === "" ||
      formData.description.trim() === "" ||
      formData.type.trim() === ""
    ) {
      setError("Fyll alla fält");
      return;
    }
    const isNameTaken = products.some(
      (p) => p.title.toLowerCase() === formData.title.toLocaleLowerCase(),
    );
    if (isNameTaken) {
      setError("Produkten måste ha unik titel");
      return;
    }

    const productData = {
      ...formData,
      weight: parseFloat(formData.weight),
      price: {
        unitPrice: parseFloat(formData.unitPrice),
        palletPrice: parseFloat(formData.palletPrice),
      },
    };

    try {
      await dispatch(createProduct(productData)).unwrap();
      setFormData({
        title: "",
        brand: "",
        weight: "",
        unitPrice: "",
        palletPrice: "",
        image: "",
        description: "",
        type: "",
      });
      navigate("/adminpanel");
    } catch (err) {
      // console.log(err);
      setError(err.response?.data?.message || "Något gick fel!");
      navigate("/");
    }
  };

  return (
    <main
      className="w-full max-w-200 mx-auto flex flex-col gap-2 p-3 font-raleway lg:text-[18px]"
      id="main-content"
      aria-labelledby="create-product-title"
    >
      {/* SEO */}
      <title>Skapa produkt | Asaad Food Admin</title>
      <meta
        name="description"
        content="Adminpanel för att skapa nya produkter i Asaad Foods sortiment."
      />

      <header>
        <h1
          className="text-center font-crimsontext font-bold text-2xl"
          id="create-product-title"
        >
          Skapa produkt
        </h1>
      </header>

      <section
        className="rounded-2xl bg-[#f9f9f9] border"
        aria-labelledby="create-product-heading"
        itemScope
        itemType="https://schema.org/Product"
      >
        <h2 id="create-product-heading" className="sr-only">
          Formulär för att skapa ny produkt
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-4 gap-3 w-full"
          aria-describedby={error ? "form-error" : undefined}
          aria-labelledby="create-product-heading"
          noValidate
        >
          {/* Error */}
          {error && (
            <p
              id="form-error"
              role="alert"
              className="text-red-500 font-medium text-sm"
              aria-live="assertive"
              aria-atomic="true"
            >
              {error}
            </p>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-semibold mb-1">
              Titel
            </label>
            <input
              itemProp="name"
              type="text"
              autoFocus
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
              required
            />
          </div>

          {/* Type + Brand */}
          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="sr-only">Produkt Typ & Märke</legend>
            <div>
              <label htmlFor="type" className="block font-semibold mb-1">
                Typ
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
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
                itemProp="brand"
                type="text"
                id="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
              />
            </div>
          </fieldset>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block font-semibold mb-1">
              Vikt (kg/L)
            </label>
            <input
              type="number"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
              required
            />
          </div>
          {/* Prices */}
          <fieldset className="grid grid-cols-2 gap-4">
            <legend className="sr-only">Priser: Styckpris & Pallpris</legend>
            <div>
              <label htmlFor="unitPrice" className="block font-semibold mb-1">
                Styckpris (kr)
              </label>
              <input
                type="number"
                id="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="palletPrice" className="block font-semibold mb-1">
                Pallpris (kr)
              </label>
              <input
                type="number"
                id="palletPrice"
                value={formData.palletPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
                required
              />
            </div>
          </fieldset>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block font-semibold mb-1">
              Bild (URL)
            </label>
            <input
              type="url"
              id="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-semibold mb-1">
              Produktinformation
            </label>
            <textarea
              itemProp="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none min-h-35"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/adminpanel")}
              className="bg-[#1E5BCC] text-white rounded-md hover:bg-[#1747A3] px-2 py-1 transition-colors duration-150 flex items-center justify-center cursor-pointer w-full border border-black"
              aria-label="Avbryt och gå tillbaka till adminpanelen"
            >
              Avbryt
            </button>

            <button
              type="submit"
              className="bg-[#1E5BCC] text-white rounded-md hover:bg-[#1747A3] px-2 py-1 transition-colors duration-150 flex items-center justify-center cursor-pointer w-full border border-black"
              aria-label="Skapa produkt"
            >
              Skapa
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default CreateProduct;
