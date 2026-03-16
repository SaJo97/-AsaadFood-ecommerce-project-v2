import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createProduct } from "@/store/products/productSlice";
import CreateProduct from "../CreateProduct";

// mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/store/products/productSlice", () => ({
  createProduct: vi.fn(),
}));

describe("CreateProduct", () => {
  const dispatchMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useDispatch.mockReturnValue(dispatchMock);
    useNavigate.mockReturnValue(navigateMock);

    useSelector.mockReturnValue({
      productList: {
        products: [],
      },
    });

    useSelector.mockReturnValue({
      products: [],
    });
  });

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText("Titel"), {
      target: { value: "Test Rice" },
    });

    fireEvent.change(screen.getByLabelText("Typ"), {
      target: { value: "Rice" },
    });

    fireEvent.change(screen.getByLabelText("Märke"), {
      target: { value: "BrandA" },
    });

    fireEvent.change(screen.getByLabelText("Vikt (kg/L)"), {
      target: { value: "5" },
    });

    fireEvent.change(screen.getByLabelText("Styckpris (kr)"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByLabelText("Pallpris (kr)"), {
      target: { value: "1000" },
    });

    fireEvent.change(screen.getByLabelText("Bild (URL)"), {
      target: { value: "https://example.com/rice.jpg" },
    });

    fireEvent.change(screen.getByLabelText("Produktinformation"), {
      target: { value: "High quality rice" },
    });
  };

  it("renders form fields", () => {
    render(<CreateProduct />);

    expect(screen.getByRole("heading", { name: "Skapa produkt" })).toBeInTheDocument();
    expect(screen.getByLabelText("Titel")).toBeInTheDocument();
    expect(screen.getByLabelText("Typ")).toBeInTheDocument();
    expect(screen.getByLabelText("Märke")).toBeInTheDocument();
  });

  it("shows error when submitting empty form", () => {
    render(<CreateProduct />);

    fireEvent.click(screen.getByRole("button", { name: "Skapa produkt" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Fyll alla fält");
  });

  it("shows error if product title already exists", () => {
    useSelector.mockReturnValue({
      products: [{ title: "Test Rice" }],
    });

    render(<CreateProduct />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: "Skapa produkt" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Produkten måste ha unik titel"
    );
  });

  it("dispatches createProduct on valid form submission", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    dispatchMock.mockReturnValue({ unwrap: unwrapMock });

    render(<CreateProduct />);

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: "Skapa produkt" }));

    expect(createProduct).toHaveBeenCalled();

    expect(dispatchMock).toHaveBeenCalled();

  });

  it("navigates back when clicking cancel", () => {
    render(<CreateProduct />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Avbryt och gå tillbaka till adminpanelen",
      })
    );

    expect(navigateMock).toHaveBeenCalledWith("/adminpanel");
  });
});