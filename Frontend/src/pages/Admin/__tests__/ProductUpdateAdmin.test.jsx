import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/store/products/productSlice";
import { useNavigate } from "react-router";
import ProductUpdateAdmin from "../components/ProductUpdateAdmin";

// Mock Redux and router hooks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/store/products/productSlice", () => ({
  updateProduct: vi.fn(),
}));

describe("ProductUpdateAdmin", () => {
  const dispatchMock = vi.fn();
  const navigateMock = vi.fn();

  const product = {
    _id: "123",
    title: "Test Product",
    brand: "BrandA",
    type: "Rice",
    weight: 5,
    price: { unitPrice: 100, palletPrice: 500 },
    image: "http://example.com/product.jpg",
    description: "A high-quality product",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
    useNavigate.mockReturnValue(navigateMock);

    useSelector.mockReturnValue({
      productList: { loading: false },
    });
  });

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Produkttitel/), {
      target: { value: "Updated Product" },
    });

    fireEvent.change(screen.getByLabelText(/Produkttyp/), {
      target: { value: "Oliveoil" },
    });

    fireEvent.change(screen.getByLabelText(/Produktmärke/), {
      target: { value: "BrandB" },
    });

    fireEvent.change(screen.getByLabelText(/Produktvikt/), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByLabelText(/Styckpris/), {
      target: { value: "150" },
    });

    fireEvent.change(screen.getByLabelText(/Pallpris/), {
      target: { value: "1500" },
    });

    fireEvent.change(screen.getByLabelText(/Produktbild URL/), {
      target: { value: "http://example.com/updated-product.jpg" },
    });

    fireEvent.change(screen.getByLabelText(/Produktbeskrivning/), {
      target: { value: "Updated product description" },
    });
  };

  it("renders with initial values from the product prop", () => {
    render(<ProductUpdateAdmin product={product} onClose={vi.fn()} />);

    expect(screen.getByLabelText(/Produkttitel/)).toHaveValue(product.title);
    expect(screen.getByLabelText(/Produktmärke/)).toHaveValue(product.brand);
    expect(screen.getByLabelText(/Produkttyp/)).toHaveValue(product.type);
    expect(screen.getByLabelText(/Produktvikt/)).toHaveValue(product.weight);
    expect(screen.getByLabelText(/Styckpris/)).toHaveValue(product.price.unitPrice);
    expect(screen.getByLabelText(/Pallpris/)).toHaveValue(product.price.palletPrice);
    expect(screen.getByLabelText(/Produktbild URL/)).toHaveValue(product.image);
    expect(screen.getByLabelText(/Produktbeskrivning/)).toHaveValue(product.description);
  });

  it("should update form data on input change", () => {
    render(<ProductUpdateAdmin product={product} onClose={vi.fn()} />);

    fillForm();  // Fill the form with new values

    expect(screen.getByLabelText(/Produkttitel/)).toHaveValue("Updated Product");
    expect(screen.getByLabelText(/Produkttyp/)).toHaveValue("Oliveoil");
    expect(screen.getByLabelText(/Produktmärke/)).toHaveValue("BrandB");
    expect(screen.getByLabelText(/Produktvikt/)).toHaveValue(10);
    expect(screen.getByLabelText(/Styckpris/)).toHaveValue(150);
    expect(screen.getByLabelText(/Pallpris/)).toHaveValue(1500);
    expect(screen.getByLabelText(/Produktbild URL/)).toHaveValue("http://example.com/updated-product.jpg");
    expect(screen.getByLabelText(/Produktbeskrivning/)).toHaveValue("Updated product description");
  });

  it("should dispatch updateProduct action on form submission", async () => {
    const updatedProduct = { ...product, title: "Updated Product" };
    dispatchMock.mockResolvedValue({});

    render(<ProductUpdateAdmin product={product} onClose={vi.fn()} />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: /Spara/ }));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        updateProduct({
          ...updatedProduct,
          price: { unitPrice: 150, palletPrice: 1500 },
        })
      );
    });
  });

  it("should handle navigation on error during form submission", async () => {
    dispatchMock.mockRejectedValue(new Error("Update failed"));

    render(<ProductUpdateAdmin product={product} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /Spara/ }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });
});