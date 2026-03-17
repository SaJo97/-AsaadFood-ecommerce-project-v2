import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

import {
  addToCart,
  removeItem,
  removeOne,
} from "@/store/cart/shoppingCartSlice";
import CartItem from "../components/CartItem";

// mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));

vi.mock("@/store/cart/shoppingCartSlice", () => ({
  addToCart: vi.fn((payload) => ({ type: "cart/addToCart", payload })),
  removeItem: vi.fn((payload) => ({ type: "cart/removeItem", payload })),
  removeOne: vi.fn((payload) => ({ type: "cart/removeOne", payload })),
}));

describe("CartItem", () => {
  const dispatchMock = vi.fn();

  const mockItem = {
    quantity: 2,
    price: 50,
    priceType: "unit",
    product: {
      _id: "1",
      title: "Test Rice",
      brand: "TestBrand",
      weight: 1,
      type: "Rice",
      image: "/test.jpg",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it("renders product information", () => {
    useLocation.mockReturnValue({ pathname: "/cart" });

    render(<CartItem item={mockItem} />);

    expect(screen.getByText("Test Rice")).toBeInTheDocument();
    expect(screen.getByText("2 × 50 kr")).toBeInTheDocument();
  });

  it("dispatches addToCart when plus button clicked", () => {
    useLocation.mockReturnValue({ pathname: "/cart" });

    render(<CartItem item={mockItem} />);

    const plusButton = screen.getByLabelText(/öka antal/i);

    fireEvent.click(plusButton);

    expect(dispatchMock).toHaveBeenCalledWith(
      addToCart({
        product: mockItem.product,
        priceType: "unit",
      })
    );
  });

  it("dispatches removeOne when minus button clicked", () => {
    useLocation.mockReturnValue({ pathname: "/cart" });

    render(<CartItem item={mockItem} />);

    const minusButton = screen.getByLabelText(/minska antal/i);

    fireEvent.click(minusButton);

    expect(dispatchMock).toHaveBeenCalledWith(
      removeOne({
        productId: "1",
        priceType: "unit",
      })
    );
  });

  it("dispatches removeItem when trash button clicked", () => {
    useLocation.mockReturnValue({ pathname: "/cart" });

    render(<CartItem item={mockItem} />);

    const deleteButton = screen.getByRole("button", {
      name: /ta bort/i,
    });

    fireEvent.click(deleteButton);

    expect(dispatchMock).toHaveBeenCalledWith(
      removeItem({
        productId: "1",
        priceType: "unit",
      })
    );
  });

  it("renders checkout layout when on checkout page", () => {
    useLocation.mockReturnValue({ pathname: "/kassa" });

    render(<CartItem item={mockItem} />);

    expect(screen.getByText("ORD.PRIS")).toBeInTheDocument();
    expect(screen.getByText("Summa")).toBeInTheDocument();
  });

  it("shows correct sum", () => {
    useLocation.mockReturnValue({ pathname: "/kassa" });

    render(<CartItem item={mockItem} />);

    expect(screen.getByText("100 kr")).toBeInTheDocument();
  });
});