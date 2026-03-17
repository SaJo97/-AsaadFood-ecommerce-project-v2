import { useEffect, useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/products/productSlice";
import FilterProducts from "./components/FilterProducts";
import ProductDetail from "./components/ProductDetail";
import useProductModal from "@/hooks/useProductModal";
import Modale from "@/components/Modale";
// import mahmoodAD from "@/assets/AsaadFoodv3.mp4";
const RiceProducts = () => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState("ALLA");
  const [videoExists, setVideoExists] = useState(true);

  if (!videoExists) return null;

  const { products, loading, error } = useSelector(
    (state) => state.productList,
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // filter rice products
  const riceProducts = products?.filter((product) => product.type === "Rice");

  // Extract brands for filter
  const brands = useMemo(() => {
    if (!riceProducts) return [];
    return ["ALLA", ...new Set(riceProducts.map((p) => p.brand))];
  }, [riceProducts]);

  // Group products by brand and filter if selected
  const groupedByBrand = riceProducts?.reduce((acc, product) => {
    if (selectedBrand !== "ALLA" && product.brand !== selectedBrand) {
      return acc;
    }

    if (!acc[product.brand]) {
      acc[product.brand] = [];
    }
    acc[product.brand].push(product);
    return acc;
  }, {});

  // sort by weight (ascending)
  Object.values(groupedByBrand ?? {}).forEach((products) =>
    products.sort((a, b) => a.weight - b.weight),
  );

  const { selectedProduct, openProduct, closeProduct } = useProductModal(
    products,
    "/produkt_ris",
  );

  // Loading / error UI
  if (error.getAll) {
    return (
      <div className="mt-10">
        <p className="text-red-500" role="alert">
          {error.getAll}
        </p>
      </div>
    );
  }
  if (loading.getAll) {
    return (
      <div className="mt-5" aria-busy="true" aria-live="polite" role="status">
        <div className="w-full h-screen aspect-video bg-[#696969] rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {/* SEO Metadata */}
      <title>Ris | Asaad Food</title>
      <meta
        name="description"
        content="Alla ris produkter av högsta kvalité hos Asaad Food"
      />
      <main className="flex flex-col items-center lg:gap-12.5 md:gap-10">
        {/* Hero section */}
        <section className="w-full max-w-225" aria-label="rice-video-heading">
          <h2 id="rice-video-heading" className="sr-only">
            Asaad Food risprodukter video
          </h2>
          {/* <div>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto md:rounded-lg"
              aria-describedby="video-description"
            >
              <source src={mahmoodAD} type="video/mp4" />
              <p className="text-center">Din webbläsare stödjer inte video.</p>
            </video>
            <p id="video-description" className="sr-only">
              Reklamvideo som visar Asaad Foods olika risprodukter.
            </p>
          </div> */}
          <div>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-auto md:rounded-lg"
              aria-describedby="video-description"
              onError={() => setVideoExists(false)}
            >
              <source src="/assets/AsaadFoodv3.mp4" type="video/mp4" />
              <p className="text-center">Din webbläsare stödjer inte video.</p>
            </video>

            <p id="video-description" className="sr-only">
              Reklamvideo som visar Asaad Foods olika risprodukter.
            </p>
          </div>
        </section>

        {/* Page heading */}
        <header className="w-full max-w-220 text-center">
          <h1 className="text-[20px] md:text-[32px] font-crimsontext font-bold">
            Våra risprodukter
          </h1>
        </header>

        {/* Brand filter */}
        <nav
          className="w-full max-w-175 bg-[#f9f9f9] mt-4 mb-4"
          aria-label="Filtrera produkter efter varumärke"
        >
          <FilterProducts
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
        </nav>

        {/* Product listing */}
        <section
          className="w-full max-w-220"
          aria-labelledby="rice-products-heading"
        >
          <h2 id="rice-products-heading" className="sr-only">
            Lista över risprodukter
          </h2>
          {Object.keys(groupedByBrand).length > 0 ? (
            Object.entries(groupedByBrand ?? {}).map(([brand, products]) => (
              <section
                key={brand}
                className="mb-4"
                aria-label={`${brand} products`}
              >
                {/* Brand header */}
                <header className="bg-[#1E5BCC] h-9 md:h-17.5 mb-6 relative">
                  <h2 className="absolute left-2 bottom-1.25 md:bottom-3.25 md:left-3 px-1 h-6.5 md:h-10.5 text-[20px] md:text-[32px] font-crimsontext font-bold bg-white">
                    {brand}
                  </h2>
                </header>

                {/* Product grid */}
                <ul
                  className="flex flex-wrap justify-center sm:justify-start gap-4 px-5 lg:px-0"
                  role="list"
                >
                  {products.map((product) => (
                    <li key={product._id} aria-label={product.title}>
                      <ProductCard
                        product={product}
                        onOpen={() => openProduct(product._id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="text-center" role="status">
              Inga produkter tillgängliga.
            </p>
          )}
        </section>
        {selectedProduct && (
          <Modale
            onClose={closeProduct}
            aria-label={`Produktdetaljer för ${selectedProduct.title}`}
          >
            <ProductDetail product={selectedProduct} onClose={closeProduct} />
          </Modale>
        )}
      </main>
    </>
  );
};
export default RiceProducts;
