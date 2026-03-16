import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import ProductDetail from "../components/ProductDetail";


// Mock react-redux hooks
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

// Mock react-router
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  default: vi.fn(),
}));

describe("ProductDetail", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  const mockOnClose = vi.fn();

  const product = {
    _id: "1",
    title: "Olive Oil Premium",
    brand: "Basso",
    type: "Oliveoil",
    image: "/olive.png",
    weight: 2,
    price: { unitPrice: 50, palletPrice: 200 },
    description: "High quality olive oil",
    packaging: { boxesPerPallet: 5, maxBoxWeight: 10 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((fn) =>
      fn({ shoppingCart: { cart: [] } })
    );
    useAuth.mockReturnValue({ isAuthenticated: true });
  });

  it("renders product info correctly", () => {
    render(<ProductDetail product={product} onClose={mockOnClose} />);
    
    // Check brand, title, weight
    expect(screen.getByText(product.brand)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: `Produktnamn: ${product.title}` })).toBeInTheDocument();
    expect(screen.getByText(/2 L/)).toBeInTheDocument();

    // Price
    expect(screen.getByLabelText(/Pris: 50 kronor/)).toBeInTheDocument();

    // Description
    expect(screen.getByRole("heading", { name: "Produktinformation" })).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it("switches price type when buttons are clicked", () => {
    render(<ProductDetail product={product} onClose={mockOnClose} />);
    
    const unitBtn = screen.getByRole("button", { name: "Styckpris" });
    const palletBtn = screen.getByRole("button", { name: "Pallpris" });

    expect(unitBtn).toHaveAttribute("aria-pressed", "true");
    expect(palletBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(palletBtn);

    expect(palletBtn).toHaveAttribute("aria-pressed", "true");
    expect(unitBtn).toHaveAttribute("aria-pressed", "false");

    expect(screen.getByLabelText(/Pris: 200 kronor/)).toBeInTheDocument();
  });

  it("adds product to cart when authenticated", () => {
    render(<ProductDetail product={product} onClose={mockOnClose} />);
    
    const addButton = screen.getByRole("button", { name: `Lägg ${product.title} i varukorgen` });
    fireEvent.click(addButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "shoppingCart/addToCart",
      payload: { product, priceType: "unit" },
    });
  });

  it("redirects to login if unauthenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    render(<ProductDetail product={product} onClose={mockOnClose} />);
    
    const addButton = screen.getByRole("button", { name: `Lägg ${product.title} i varukorgen` });
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/auth/logga-in");
  });

  it("increments and decrements quantity when in cart", () => {
    useSelector.mockImplementation((fn) =>
      fn({ shoppingCart: { cart: [{ product, priceType: "unit", quantity: 2 }] } })
    );

    render(<ProductDetail product={product} onClose={mockOnClose} />);

    const decreaseBtn = screen.getByRole("button", { name: `Minska antal ${product.title} i varukorgen` });
    const increaseBtn = screen.getByRole("button", { name: `Öka antal ${product.title} i varukorgen` });

    fireEvent.click(decreaseBtn);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "shoppingCart/removeOne",
      payload: { productId: product._id, priceType: "unit" },
    });

    fireEvent.click(increaseBtn);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "shoppingCart/addToCart",
      payload: { product, priceType: "unit" },
    });
  });

  it("renders packaging info correctly", () => {
    render(<ProductDetail product={product} onClose={mockOnClose} />);
    
    expect(screen.getByText(/1 kartong: 5 st/)).toBeInTheDocument();
    expect(screen.getByText(/1 pall: 5 kartonger/)).toBeInTheDocument();
    expect(screen.getByText(/Totalt per pall: 25 st/)).toBeInTheDocument();
    expect(screen.getByText(/Pallpris - styck: 8 kr/)).toBeInTheDocument();
  });
});