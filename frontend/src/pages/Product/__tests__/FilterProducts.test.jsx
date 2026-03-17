import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilterProducts from "../components/FilterProducts";

describe("FilterProducts", () => {
  const brands = ["ALLA", "Basso", "DeCecco"];
  const mockSelectBrand = vi.fn();

  const renderComponent = (selectedBrand = "ALLA") => {
    render(
      <FilterProducts
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={mockSelectBrand}
      />
    );
  };

  it("renders filter heading", () => {
    renderComponent();

    const heading = screen.getByRole("heading", {
      name: /filtrera produkter/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders all brand buttons", () => {
    renderComponent();

    brands.forEach((brand) => {
      expect(
        screen.getByRole("button", { name: brand })
      ).toBeInTheDocument();
    });
  });

  it("marks selected brand with aria-pressed", () => {
    renderComponent("Basso");

    const selectedButton = screen.getByRole("button", {
      name: "Basso",
    });

    expect(selectedButton).toHaveAttribute("aria-pressed", "true");
  });

  it("marks non-selected brands as aria-pressed=false", () => {
    renderComponent("Basso");

    const otherButton = screen.getByRole("button", {
      name: "ALLA",
    });

    expect(otherButton).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelectBrand when a brand is clicked", () => {
    renderComponent();

    const button = screen.getByRole("button", {
      name: "Basso",
    });

    fireEvent.click(button);

    expect(mockSelectBrand).toHaveBeenCalledWith("Basso");
  });

  it("renders filter group with accessible label", () => {
    renderComponent();

    const group = screen.getByRole("group", {
      name: /filtrera produkter/i,
    });

    expect(group).toBeInTheDocument();
  });
});