const FilterProducts = ({ brands, selectedBrand, onSelectBrand }) => {
  return (
    <section aria-labelledby="filter-heading">
      {/* Filter heading */}
      <h2
        className="underline text-[16px] md:text-[20px] font-crimsontext font-bold text-center p-2"
        id="filter-heading"
      >
        Filtrera produkter
      </h2>

      {/* Brand buttons */}
      <div
        className="flex gap-3 flex-wrap justify-center px-4 py-3"
        role="group"
        aria-labelledby="filter-heading"
      >
        {brands.map((brand) => {
          const isActive = brand === selectedBrand;

          return (
            <button
              key={brand}
              type="button"
              onClick={() => onSelectBrand(brand)}
              aria-pressed={isActive}
              className={`
              px-1 whitespace-nowrap text-[16px] md:text-[20px] font-crimsontext
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#1E5BCC]
              ${
                isActive
                  ? "bg-[#1E5BCC] text-white"
                  : "bg-white text-black border border-black"
              }
            `}
            >
              {brand}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default FilterProducts;
