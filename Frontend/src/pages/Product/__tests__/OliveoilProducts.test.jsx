import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/products/productSlice";
import OliveoilProducts from "../OliveoilProducts";

// redux mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("@/store/products/productSlice", () => ({
  getAllProducts: vi.fn(),
}));

// component mocks
vi.mock("../components/ProductCard", () => ({
  default: ({ product }) => <div data-testid="product">{product.title}</div>,
}));

vi.mock("../components/FilterProducts", () => ({
  default: () => <div data-testid="filter">Filter</div>,
}));

vi.mock("../components/ProductDetail", () => ({
  default: () => <div data-testid="product-detail">Product Detail</div>,
}));

vi.mock("@/components/Modale", () => ({
  default: ({ children }) => <div data-testid="modal">{children}</div>,
}));

// hook mock
vi.mock("@/hooks/useProductModal", () => ({
  default: () => ({
    selectedProduct: null,
    openProduct: vi.fn(),
    closeProduct: vi.fn(),
  }),
}));

// asset mock
vi.mock("@/assets/bassoAD.svg", () => ({
  default: "bassoAD.svg",
}));

describe("OliveoilProducts", () => {
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

    render(<OliveoilProducts />);

    expect(dispatchMock).toHaveBeenCalledWith(getAllProducts());
  });

  it("shows loading state", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: { getAll: true },
      error: { getAll: null },
    });

    render(<OliveoilProducts />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: { getAll: false },
      error: { getAll: "Failed to load products" },
    });

    render(<OliveoilProducts />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load products"
    );
  });

  it("renders only olive oil products", () => {
    useSelector.mockReturnValue({
      products: [
        {
          _id: "1",
          title: "Extra Virgin",
          brand: "BrandA",
          type: "Oliveoil",
          weight: 1,
        },
        {
          _id: "2",
          title: "Organic Olive Oil",
          brand: "BrandA",
          type: "Oliveoil",
          weight: 2,
        },
        {
          _id: "3",
          title: "Rice",
          brand: "BrandB",
          type: "Rice",
          weight: 1,
        },
      ],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<OliveoilProducts />);

    const products = screen.getAllByTestId("product");

    expect(products.length).toBe(2);
    expect(screen.getByText("Extra Virgin")).toBeInTheDocument();
    expect(screen.getByText("Organic Olive Oil")).toBeInTheDocument();
  });

  it("renders brand headers", () => {
    useSelector.mockReturnValue({
      products: [
        {
          _id: "1",
          title: "Oil 1",
          brand: "BrandA",
          type: "Oliveoil",
          weight: 1,
        },
        {
          _id: "2",
          title: "Oil 2",
          brand: "BrandB",
          type: "Oliveoil",
          weight: 2,
        },
      ],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<OliveoilProducts />);

    expect(screen.getByText("BrandA")).toBeInTheDocument();
    expect(screen.getByText("BrandB")).toBeInTheDocument();
  });

  it("shows empty state if no olive oil products exist", () => {
    useSelector.mockReturnValue({
      products: [
        {
          _id: "1",
          title: "Rice",
          brand: "BrandA",
          type: "Rice",
          weight: 1,
        },
      ],
      loading: { getAll: false },
      error: { getAll: null },
    });

    render(<OliveoilProducts />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Inga produkter tillgängliga"
    );
  });
});