import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { deleteProduct } from "@/store/products/productSlice";
import ProductCardAdmin from "../components/ProductCardAdmin";

/* ---------------- MOCKS ---------------- */

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/store/products/productSlice", () => ({
  deleteProduct: vi.fn(() => ({ unwrap: vi.fn() })),
}));

describe("ProductCardAdmin", () => {
  const dispatchMock = vi.fn();
  const navigateMock = vi.fn();
  const onOpenMock = vi.fn();

  const product = {
    _id: "123",
    title: "Test Product",
    brand: "BrandX",
    type: "Rice",
    weight: 5,
    price: { unitPrice: 50, palletPrice: 400 },
    image: "https://example.com/product.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
    useNavigate.mockReturnValue(navigateMock);
  });

  it("renders product info correctly", () => {
    render(<ProductCardAdmin product={product} onOpen={onOpenMock} />);

    expect(screen.getByText(product.brand)).toBeInTheDocument();
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(`${product.weight} kg`)).toBeInTheDocument();
    expect(
      screen.getByText(`Styckpris: ${product.price.unitPrice} kr`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Pallpris: ${product.price.palletPrice} kr`),
    ).toBeInTheDocument();

    const img = screen.getByRole("img", {
      name: `${product.title} från ${product.brand}`,
    });
    expect(img).toHaveAttribute("src", product.image);
  });

  it("uses correct weight metric for Oliveoil", () => {
    const oliveProduct = { ...product, type: "Oliveoil", weight: 2 };
    render(<ProductCardAdmin product={oliveProduct} onOpen={onOpenMock} />);

    expect(screen.getByText("2 L")).toBeInTheDocument();
  });

  it("calls deleteProduct when delete button is clicked", async () => {
    const unwrapMock = vi.fn().mockResolvedValue(); // simulate successful unwrap
    deleteProduct.mockImplementation((id) => ({ unwrap: unwrapMock }));

    // Mock dispatch to actually call the function returned by deleteProduct
    dispatchMock.mockImplementation((fn) => fn);

    render(<ProductCardAdmin product={product} onOpen={onOpenMock} />);

    const deleteBtn = screen.getByRole("button", {
      name: `Ta bort produkten ${product.title}`,
    });
    await fireEvent.click(deleteBtn);

    expect(deleteProduct).toHaveBeenCalledWith(product._id);
    expect(unwrapMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("navigates to / on delete error", async () => {
    const unwrapMock = vi.fn().mockRejectedValue("error");
    deleteProduct.mockReturnValue({ unwrap: unwrapMock });

    render(<ProductCardAdmin product={product} onOpen={onOpenMock} />);

    const deleteBtn = screen.getByRole("button", {
      name: `Ta bort produkten ${product.title}`,
    });
    await fireEvent.click(deleteBtn);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("calls onOpen when edit button is clicked", () => {
    render(<ProductCardAdmin product={product} onOpen={onOpenMock} />);

    const editBtn = screen.getByRole("button", {
      name: `Ändra produkten ${product.title}`,
    });
    fireEvent.click(editBtn);

    expect(onOpenMock).toHaveBeenCalled();
  });
});
