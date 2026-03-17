import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import useProductModal from "@/hooks/useProductModal";
import { MemoryRouter } from "react-router";
import AdminPage from "../AdminPage";

// mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("@/hooks/useProductModal");

vi.mock("../Product/components/FilterProducts", () => ({
  default: () => <div data-testid="filter-products" />,
}));

vi.mock("../components/ProductCardAdmin", () => ({
  default: ({ product }) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));

vi.mock("../components/ProductUpdateAdmin", () => ({
  default: () => <div data-testid="product-update" />,
}));

vi.mock("@/components/Modale", () => ({
  default: ({ children }) => <div data-testid="modal">{children}</div>,
}));

describe("AdminPage", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);

    useProductModal.mockReturnValue({
      selectedProduct: null,
      openProduct: vi.fn(),
      closeProduct: vi.fn(),
    });
  });

  it("renders loading state", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: { getAll: true },
      error: {},
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error message", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: {},
      error: { getAll: "Failed to fetch products" },
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to fetch products",
    );
  });

  it("renders products grouped by brand", () => {
    const products = [
      { _id: "1", title: "Rice 1kg", brand: "BrandA", weight: 1 },
      { _id: "2", title: "Rice 2kg", brand: "BrandA", weight: 2 },
      { _id: "3", title: "Beans", brand: "BrandB", weight: 1 },
    ];

    useSelector.mockReturnValue({
      products,
      loading: {},
      error: {},
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "BrandA" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "BrandB" })).toBeInTheDocument();

    expect(screen.getByText("Rice 1kg")).toBeInTheDocument();
    expect(screen.getByText("Rice 2kg")).toBeInTheDocument();
    expect(screen.getByText("Beans")).toBeInTheDocument();
  });

  it("shows empty message when no products exist", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: {},
      error: {},
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Inga produkter hittades.")).toBeInTheDocument();
  });

  it("renders modal when selectedProduct exists", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: {},
      error: {},
    });

    useProductModal.mockReturnValue({
      selectedProduct: { _id: "1" },
      openProduct: vi.fn(),
      closeProduct: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("product-update")).toBeInTheDocument();
  });

  it("dispatches getAllProducts on mount", () => {
    useSelector.mockReturnValue({
      products: [],
      loading: {},
      error: {},
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(dispatchMock).toHaveBeenCalled();
  });
});
