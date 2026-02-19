const FilterProducts = ({ brands, selectedBrand, onSelectBrand }) => {
  return (
    <nav aria-label="Product brand filters">
      {/* Filter heading */}
      <h2 className="underline text-[16px] font-crimsontext font-bold text-center p-2">
        Filter
      </h2>

      {/* Brand buttons */}
      <div
        className="flex gap-3 overflow-x-auto px-4 py-3"
        role="group"
        aria-label="Filter products by brand"
      >
        {brands.map((brand) => {
          const isActive = brand === selectedBrand;

          return (
            <button
              key={brand}
              onClick={() => onSelectBrand(brand)}
              className={`
              px-1 whitespace-nowrap text-[16px] md:text-[20px] font-crimsontext
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1E5BCC]
              ${
                isActive
                  ? "bg-[#1E5BCC] text-white"
                  : "bg-white text-black border border-black"
              }
            `}
              aria-pressed={isActive}
              aria-label={`Filter by brand: ${brand}${isActive ? ", selected" : ""}`}
            >
              {brand}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FilterProducts;
