import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import ProductCard from "../components/ProductCard";

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

describe("ProductCard", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  const mockOnOpen = vi.fn();

  const product = {
    _id: "1",
    title: "Olive Oil Premium",
    brand: "Basso",
    type: "Oliveoil",
    image: "/olive.png",
    weight: 2,
    price: { unitPrice: 50, palletPrice: 200 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((fn) => fn({ shoppingCart: { cart: [] } }));
    useAuth.mockReturnValue({ isAuthenticated: true });
  });

  it("renders product info correctly", () => {
    render(<ProductCard product={product} onOpen={mockOnOpen} />);
    expect(
      screen.getByRole("button", { name: /Öppna detaljer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Olive Oil Premium/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Basso/i)).toBeInTheDocument();
    expect(screen.getByText(/2 L/i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
  });

  it("switches price type when buttons are clicked", () => {
    render(<ProductCard product={product} onOpen={mockOnOpen} />);
    const unitBtn = screen.getByRole("button", { name: /Styckpris/i });
    const palletBtn = screen.getByRole("button", { name: /Pallpris/i });

    expect(unitBtn).toHaveAttribute("aria-pressed", "true");
    expect(palletBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(palletBtn);

    expect(palletBtn).toHaveAttribute("aria-pressed", "true");
    expect(unitBtn).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText(/200/i)).toBeInTheDocument();
  });

  it("calls dispatch addToCart when adding product to cart (authenticated)", () => {
    render(<ProductCard product={product} onOpen={mockOnOpen} />);
    const addButton = screen.getByRole("button", {
      name: /Add Olive Oil Premium to cart/i,
    });
    fireEvent.click(addButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "shoppingCart/addToCart",
      payload: { product, priceType: "unit" },
    });
  });

  it("redirects to login if unauthenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    render(<ProductCard product={product} onOpen={mockOnOpen} />);
    const addButton = screen.getByRole("button", {
      name: /Add Olive Oil Premium to cart/i,
    });
    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith("/auth/logga-in");
  });

  it("increments and decrements quantity when in cart", () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [{ product, priceType: "unit", quantity: 2 }],
        },
      }),
    );
    render(<ProductCard product={product} onOpen={mockOnOpen} />);

    const decreaseBtn = screen.getByRole("button", {
      name: /Minska antal Olive Oil Premium/i,
    });
    const increaseBtn = screen.getByRole("button", {
      name: /Öka antal Olive Oil Premium/i,
    });

    fireEvent.click(decreaseBtn);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "shoppingCart/removeOne",
      payload: { productId: "1", priceType: "unit" },
    });

    fireEvent.click(increaseBtn);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "shoppingCart/addToCart",
      payload: { product, priceType: "unit" },
    });
  });

  it("calls onOpen when image/brand area is clicked", () => {
    render(<ProductCard product={product} onOpen={mockOnOpen} />);
    const clickableArea = screen.getByRole("button", {
      name: /Öppna detaljer för Olive Oil Premium/i,
    });
    fireEvent.click(clickableArea);
    expect(mockOnOpen).toHaveBeenCalled();
  });
});
