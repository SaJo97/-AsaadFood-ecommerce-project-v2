import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/products/productSlice";
import RiceProducts from "../RiceProducts";

// mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("@/store/products/productSlice", () => ({
  getAllProducts: vi.fn(),
}));

vi.mock("../components/ProductCard", () => ({
  default: ({ product }) => <div data-testid="product">{product.title}</div>,
}));

vi.mock("../components/FilterProducts", () => ({
  default: () => <div data-testid="filter">Filter</div>,
}));

vi.mock("../components/ProductDetail", () => ({
  default: () => <div data-testid="product-detail">Detail</div>,
}));

vi.mock("@/components/Modale", () => ({
  default: ({ children }) => <div data-testid="modal">{children}</div>,
}));

vi.mock("@/hooks/useProductModal", () => ({
  default: () => ({
    selectedProduct: null,
    openProduct: vi.fn(),
    closeProduct: vi.fn(),
  }),
}));

vi.mock("@/assets/AsaadFoodv3.mp4", () => ({
  default: "video.mp4",
}));

describe("RiceProducts", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it("dispatches getAllProducts on mount", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<RiceProducts />);

    expect(dispatchMock).toHaveBeenCalledWith(getAllProducts());
  });

  it("shows loading state", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: { getAll: true },
      error: { getAll: null },
    });

    render(<RiceProducts />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: { getAll: false },
      error: { getAll: "Failed to load products" },
    });

    render(<RiceProducts />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load products"
    );
  });

  it("renders only rice products", () => {
    useSelector.mockReturnValue({
      products: [
        { _id: "1", title: "Basmati", brand: "BrandA", type: "Rice", weight: 1 },
        { _id: "2", title: "Jasmine", brand: "BrandA", type: "Rice", weight: 2 },
        { _id: "3", title: "Pasta", brand: "BrandB", type: "Pasta", weight: 1 },
      ],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<RiceProducts />);

    const products = screen.getAllByTestId("product");

    expect(products.length).toBe(2);
    expect(screen.getByText("Basmati")).toBeInTheDocument();
    expect(screen.getByText("Jasmine")).toBeInTheDocument();
  });

  it("renders brand headers", () => {
    useSelector.mockReturnValue({
      products: [
        { _id: "1", title: "Rice1", brand: "BrandA", type: "Rice", weight: 1 },
        { _id: "2", title: "Rice2", brand: "BrandB", type: "Rice", weight: 2 },
      ],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<RiceProducts />);

    expect(screen.getByText("BrandA")).toBeInTheDocument();
    expect(screen.getByText("BrandB")).toBeInTheDocument();
  });

  it("shows empty state if no rice products", () => {
    useSelector.mockReturnValue({
      products: [
        { _id: "1", title: "Pasta", brand: "BrandA", type: "Pasta", weight: 1 },
      ],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<RiceProducts />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Inga produkter tillgängliga"
    );
  });
});