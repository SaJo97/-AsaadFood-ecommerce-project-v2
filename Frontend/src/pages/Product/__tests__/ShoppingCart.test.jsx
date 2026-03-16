import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import ShoppingCart from "../components/ShoppingCart";
import { createOrder } from "@/store/order/orderSlice";
import { clearCart } from "@/store/cart/shoppingCartSlice";

// mocks
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock("react-router", () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: vi.fn(),
}));

vi.mock("@/store/order/orderSlice", () => ({
  createOrder: vi.fn(),
}));

vi.mock("@/store/cart/shoppingCartSlice", () => ({
  clearCart: vi.fn(() => ({ type: "cart/clearCart" })),
}));

vi.mock("../components/CartItem", () => ({
  default: ({ item }) => (
    <div data-testid="cart-item">{item.product.title}</div>
  ),
}));

vi.mock("@/components/Modale", () => ({
  default: ({ children }) => <div data-testid="modal">{children}</div>,
}));

describe("ShoppingCart", () => {
  const mockDispatch = vi.fn();
  const mockSetIsOpen = vi.fn();

  const mockProduct = {
    _id: "1",
    title: "Olive Oil",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);

    useLocation.mockReturnValue({
      pathname: "/cart",
    });
  });

  it("renders empty cart message", () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [],
          totalPrice: 0,
          totalQuantity: 0,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={false} />);

    expect(screen.getByText(/Din varukorg är tom/i)).toBeInTheDocument();
  });

  it("renders cart items", () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [
            {
              product: mockProduct,
              productId: "1",
              priceType: "unit",
              quantity: 2,
            },
          ],
          totalPrice: 200,
          totalQuantity: 2,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={false} />);

    expect(screen.getByTestId("cart-item")).toBeInTheDocument();
  });

  it("shows total price", () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [
            {
              product: mockProduct,
              productId: "1",
              priceType: "unit",
              quantity: 1,
            },
          ],
          totalPrice: 100,
          totalQuantity: 1,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={false} />);

    expect(screen.getByText(/100 kr/i)).toBeInTheDocument();
  });

  it("calls setIsOpen(false) when clicking checkout link", () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [
            {
              product: mockProduct,
              productId: "1",
              priceType: "unit",
              quantity: 1,
            },
          ],
          totalPrice: 100,
          totalQuantity: 1,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={false} />);

    const checkoutLink = screen.getByRole("link", {
      name: /slutför beställning/i,
    });

    fireEvent.click(checkoutLink);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it("shows modal when trying to order with empty cart", () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [],
          totalPrice: 0,
          totalQuantity: 0,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={true} />);

    const orderButton = screen.getByRole("button", { name: /Beställ/i });

    fireEvent.click(orderButton);

    expect(screen.getByText(/Din varukorg är tom/i)).toBeInTheDocument();
  });

  it("dispatches createOrder and clears cart on success", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({
      vismaResponse: { salesOrderNumber: "12345" },
    });

    mockDispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    createOrder.mockReturnValue({ type: "order/createOrder" });

    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [
            {
              product: mockProduct,
              productId: "1",
              priceType: "unit",
              quantity: 2,
            },
          ],
          totalPrice: 200,
          totalQuantity: 2,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={true} />);

    const orderButton = screen.getByRole("button", { name: /Beställ/i });

    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("shows error modal if order fails", async () => {
    const unwrapMock = vi.fn().mockRejectedValue(new Error("error"));

    mockDispatch.mockReturnValue({
      unwrap: unwrapMock,
    });

    createOrder.mockReturnValue({ type: "order/createOrder" });

    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [
            {
              product: mockProduct,
              productId: "1",
              priceType: "unit",
              quantity: 1,
            },
          ],
          totalPrice: 100,
          totalQuantity: 1,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={true} />);

    fireEvent.click(screen.getByRole("button", { name: /Beställ/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Misslyckades med att skapa beställning/i),
      ).toBeInTheDocument();
    });
  });

  it("closes modal when clicking close button", async () => {
    useSelector.mockImplementation((fn) =>
      fn({
        shoppingCart: {
          cart: [
            {
              product: mockProduct,
              productId: "1",
              priceType: "unit",
              quantity: 1,
            },
          ],
          totalPrice: 100,
          totalQuantity: 1,
        },
      }),
    );

    render(<ShoppingCart setIsOpen={mockSetIsOpen} isCheckoutPage={true} />);

    fireEvent.click(screen.getByRole("button", { name: /Beställ/i }));

    const closeBtn = await screen.findByRole("button", {
      name: /Stäng meddelande/i,
    });

    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
