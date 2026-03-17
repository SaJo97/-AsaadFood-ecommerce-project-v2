// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

// Assets mocks
vi.mock("@/assets/reseller/coop.svg", () => ({ default: "coop.svg" }));
vi.mock("@/assets/reseller/costco.svg", () => ({ default: "costco.svg" }));
vi.mock("@/assets/reseller/fyndmarknad.svg", () => ({
  default: "fyndmarknad.svg",
}));
vi.mock("@/assets/reseller/hemkop.svg", () => ({ default: "hemkop.svg" }));
vi.mock("@/assets/reseller/hypermat.svg", () => ({ default: "hypermat.svg" }));
vi.mock("@/assets/reseller/ica.svg", () => ({ default: "ica.svg" }));
vi.mock("@/assets/reseller/lidl.svg", () => ({ default: "lidl.svg" }));
vi.mock("@/assets/reseller/matrebellen.svg", () => ({
  default: "matrebellen.svg",
}));
vi.mock("@/assets/reseller/tempo.svg", () => ({ default: "tempo.svg" }));
vi.mock("@/assets/reseller/willys.svg", () => ({ default: "willys.svg" }));

//carousel mocks
vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children, ...props }) => (
    <div data-testid="carousel" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselNext: (props) => <button data-testid="carousel-next" {...props} />,
  CarouselPrevious: (props) => (
    <button data-testid="carousel-previous" {...props} />
  ),
}));

// Autoplay plugin mocks
vi.mock("embla-carousel-autoplay", () => {
  const mockAutoplay = vi.fn(() => ({}));
  return {
    default: mockAutoplay,
  };
});

import Autoplay from "embla-carousel-autoplay";
import CompanyReseller from "../components/CompanyReseller";

// Tests
describe("CompanyReseller Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<CompanyReseller />);
    expect(screen.getByText("Våra återförsäljare")).toBeInTheDocument();
  });

  test("renders mobile carousel with correct structure", () => {
    render(<CompanyReseller />);

    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-content")).toBeInTheDocument();
    expect(screen.getAllByTestId("carousel-item")).toHaveLength(10);
  });

  test("renders all reseller logos in the carousel", () => {
    render(<CompanyReseller />);

    const logos = screen.getAllByRole("img");
    expect(logos).toHaveLength(20);
    // 10 in carousel + 10 in desktop grid
  });

  test("carousel images have correct src and alt text", () => {
    render(<CompanyReseller />);

    const hemkop = screen.getByAltText(
      "Hemköp - officiell återförsäljare av Asaad Food",
    );
    expect(hemkop).toHaveAttribute("src", "hemkop.svg");

    const costco = screen.getByAltText(
      "Costco - officiell återförsäljare av Asaad Food",
    );
    expect(costco).toHaveAttribute("src", "costco.svg");
  });

  test("applies Autoplay plugin with correct options", () => {
    render(<CompanyReseller />);

    expect(vi.mocked(Autoplay)).toHaveBeenCalledWith({
      delay: 5000,
      stopOnInteraction: false,
    });
  });

  test("has correct aria-labels for accessibility", () => {
    render(<CompanyReseller />);

    expect(screen.getByTestId("carousel")).toHaveAttribute(
      "aria-label",
      "Karusell med våra återförsäljares logotyper",
    );

    expect(screen.getByTestId("carousel-previous")).toHaveAttribute(
      "aria-label",
      "Visa föregående återförsäljare",
    );

    expect(screen.getByTestId("carousel-next")).toHaveAttribute(
      "aria-label",
      "Visa nästa återförsäljare",
    );

    expect(
      screen.getByLabelText("Lista över våra återförsäljare"),
    ).toBeInTheDocument();
  });

  test("desktop reseller list is rendered as a grid", () => {
    render(<CompanyReseller />);

    const section = screen.getByLabelText("Lista över våra återförsäljare");
    const list = section.querySelector("ul");

    expect(list).toBeInTheDocument();
    expect(list).toHaveClass("grid", "grid-cols-5");
  });

  test("navigation buttons are hidden on small screens", () => {
    render(<CompanyReseller />);

    const prevButton = screen.getByTestId("carousel-previous");
    const nextButton = screen.getByTestId("carousel-next");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
