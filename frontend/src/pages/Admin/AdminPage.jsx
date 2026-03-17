import { useDispatch, useSelector } from "react-redux";
import FilterProducts from "../Product/components/FilterProducts";
import { getAllProducts } from "@/store/products/productSlice";
import { useEffect, useMemo, useState } from "react";
import ProductCardAdmin from "./components/ProductCardAdmin";
import ProductUpdateAdmin from "./components/ProductUpdateAdmin";
import Modale from "@/components/Modale";
import useProductModal from "@/hooks/useProductModal";
import { Link } from "react-router";

const AdminPage = () => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState("ALLA");

  const { products, loading, error } = useSelector(
    (state) => state.productList,
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Extract brands for filter
  const brands = useMemo(() => {
    if (!products) return [];
    return ["ALLA", ...new Set(products.map((p) => p.brand))];
  }, [products]);

  // Group products by brand and filter if selected
  const groupedByBrand = (products ?? []).reduce((acc, product) => {
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
    "/adminpanel",
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
      <title>Adminpanel | Asaad Food</title>
      <meta
        name="description"
        content="Adminpanel för att hantera produkter hos Asaad Food. Skapa, redigera och organisera produkter."
      />
      <main
        className="flex flex-col items-center"
        id="main-content"
        aria-labelledby="admin-heading"
      >
        <section className="w-full max-w-225">
          <header className="p-1 md:p-0">
            <h1
              className="text-center font-crimsontext font-bold text-[18px] md:text-[24px] lg:text-3xl"
              id="admin-heading"
            >
              Admin-panel
            </h1>
          </header>

          <nav aria-label="Administrationsåtgärder">
            <ul className="flex flex-col gap-1 px-2">
              <li>
                <Link
                  to="/adminpanel/skapa"
                  className="inline-block px-2 py-2 bg-[#1E5BCC] text-white md:text-[20px] rounded focus:outline focus:outline-offset-2 focus:outline-blue-600"
                  aria-label="Skapa en ny produkt"
                >
                  Skapa ny produkt
                </Link>
              </li>
              <li>
                <Link
                  to="/adminpanel/hantera"
                  className="inline-block px-2 py-2 bg-[#1E5BCC] text-white md:text-[20px] rounded focus:outline focus:outline-offset-2 focus:outline-blue-600"
                  aria-label="Hantera användarkonton"
                >
                  Hantera användare
                </Link>
              </li>
            </ul>
          </nav>
        </section>

        <section
          className="w-full max-w-175 bg-[#f9f9f9] mt-4 mb-4"
          aria-labelledby="filter-heading"
        >
          <h2 id="filter-heading" className="sr-only">
            Filtrera produkter efter varumärke
          </h2>
          <FilterProducts
            brands={brands}
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
        </section>

        <section
          className="w-full max-w-220"
          aria-labelledby="products-heading"
        >
          <h2 id="products-heading" className="sr-only">
            Produktlista
          </h2>

          {Object.keys(groupedByBrand).length > 0 ? (
            Object.entries(groupedByBrand ?? {}).map(([brand, products]) => (
              <section
                key={brand}
                className="mb-4"
                aria-labelledby={`brand-heading-${brand}`}
              >
                {/* Brand header */}
                <header className="bg-[#1E5BCC] h-9 md:h-17.5 mb-6 relative">
                  <h3
                    className="absolute left-2 bottom-1.25 md:bottom-3.25 md:left-3 px-1 h-6.5 md:h-10.5 text-[20px] md:text-[32px] font-crimsontext font-bold bg-white"
                    id={`brand-heading-${brand}`}
                  >
                    {brand}
                  </h3>
                </header>

                {/* Product grid */}
                <ul
                  className="flex flex-wrap justify-center sm:justify-start gap-4 px-5 lg:px-0"
                  role="list"
                >
                  {products.map((product) => (
                    <li key={product._id}>
                      <article aria-labelledby={`product-${product._id}`}>
                        <ProductCardAdmin
                          product={product}
                          onOpen={() => openProduct(product._id)}
                        />
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p role="status" aria-live="polite" className="text-center">
              Inga produkter hittades.
            </p>
          )}
        </section>
        {selectedProduct && (
          <Modale
            onClose={closeProduct}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-heading"
          >
            <ProductUpdateAdmin
              product={selectedProduct}
              onClose={closeProduct}
            />
          </Modale>
        )}
      </main>
    </>
  );
};
export default AdminPage;
