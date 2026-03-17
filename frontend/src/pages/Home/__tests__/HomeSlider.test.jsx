// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import HomeSlider from "../components/HomeSlider";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock each SVG asset individually (return an object with 'default' for ES module default exports)
vi.mock("@/assets/mahmoodrice.svg", () => ({ default: "mahmoodrice.svg" }));
vi.mock("@/assets/doublekangaroo.svg", () => ({
  default: "doublekangaroo.svg",
}));
vi.mock("@/assets/smartchef.svg", () => ({ default: "smartchef.svg" }));
vi.mock("@/assets/sevimli.svg", () => ({ default: "sevimli.svg" }));
vi.mock("@/assets/bassologo.svg", () => ({ default: "bassologo.svg" }));
vi.mock("@/assets/basso1.svg", () => ({ default: "basso1.svg" }));
vi.mock("@/assets/basso2.svg", () => ({ default: "basso2.svg" }));
vi.mock("@/assets/basso3.svg", () => ({ default: "basso3.svg" }));

// Mock the Embla Carousel components
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

// Mock the Autoplay plugin (define the mock inside the factory to avoid hoisting issues)
vi.mock("embla-carousel-autoplay", () => {
  const mockAutoplay = vi.fn(() => ({}));
  return {
    default: mockAutoplay,
  };
});

// Import the mocked
import Autoplay from "embla-carousel-autoplay";

describe("HomeSlider Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<HomeSlider />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  test("displays the carousel with correct structure", () => {
    render(<HomeSlider />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getByTestId("carousel-content")).toBeInTheDocument();
    expect(screen.getAllByTestId("carousel-item")).toHaveLength(2); // Two slides
  });

  test("renders the first slide with rice brands content", () => {
    render(<HomeSlider />);
    const items = screen.getAllByTestId("carousel-item");
    const firstItem = items[0];

    // Check for specific text in the first slide
    expect(firstItem).toHaveTextContent("Upptäck våra välkända risvarumärken!");
    expect(firstItem).toHaveTextContent(
      "Vi arbetar direkt med ledande producenter och leverantörer",
    );

    // Check for images (src now matches the mocked strings)
    const mahmoodImg = screen.getByAltText(
      "Mahmood Rice – premiumris importerad av Asaad Food",
    );
    expect(mahmoodImg).toBeInTheDocument();
    expect(mahmoodImg).toHaveAttribute("src", "mahmoodrice.svg");

    const sevimliImg = screen.getByAltText(
      "Sevimli ris – officiellt varumärke hos Asaad Food",
    );
    expect(sevimliImg).toBeInTheDocument();
    expect(sevimliImg).toHaveAttribute("src", "sevimli.svg");

    const kangarooImg = screen.getByAltText(
      "Double Kangaroo ris – kvalitetsris från Asaad Food",
    );
    expect(kangarooImg).toBeInTheDocument();
    expect(kangarooImg).toHaveAttribute("src", "doublekangaroo.svg");

    const chefImg = screen.getByAltText(
      "Smart Chef ris – professionellt ris för restauranger",
    );
    expect(chefImg).toBeInTheDocument();
    expect(chefImg).toHaveAttribute("src", "smartchef.svg");
  });

  test("renders the second slide with olive oil content", () => {
    render(<HomeSlider />);
    const items = screen.getAllByTestId("carousel-item");
    const secondItem = items[1];

    // Check for specific text in the second slide
    expect(secondItem).toHaveTextContent("Upptäck vår utsökta olivolja Basso!");
    expect(secondItem).toHaveTextContent(
      "Vi samarbetar nära med traditionella olivodlingar i Medelhavet",
    );

    // Check for images (src now matches the mocked strings)
    const bassoLogoImg = screen.getByAltText(
      "Basso – extra jungfrulig olivolja av hög kvalitet",
    );
    expect(bassoLogoImg).toBeInTheDocument();
    expect(bassoLogoImg).toHaveAttribute("src", "bassologo.svg");

    const basso1Img = screen.getByAltText("basso olivolja produkt1");
    expect(basso1Img).toBeInTheDocument();
    expect(basso1Img).toHaveAttribute("src", "basso1.svg");

    const basso2Img = screen.getByAltText("basso olivolja produkt2");
    expect(basso2Img).toBeInTheDocument();
    expect(basso2Img).toHaveAttribute("src", "basso2.svg");

    const basso3Img = screen.getByAltText("basso olivolja produkt3");
    expect(basso3Img).toBeInTheDocument();
    expect(basso3Img).toHaveAttribute("src", "basso3.svg");
  });

  test("has correct aria-labels for carousel and navigation", () => {
    render(<HomeSlider />);
    expect(screen.getByTestId("carousel")).toHaveAttribute(
      "aria-label",
      "Produktkarusell med risvarumärken och olivolja",
    );
    expect(screen.getByTestId("carousel-previous")).toHaveAttribute(
      "aria-label",
      "Visa föregående bild i produktkarusellen",
    );
    expect(screen.getByTestId("carousel-next")).toHaveAttribute(
      "aria-label",
      "Visa nästa bild i produktkarusellen",
    );
  });

  test("applies Autoplay plugin with correct options", () => {
    render(<HomeSlider />);
    // Access the mocked Autoplay function and check if it was called
    expect(vi.mocked(Autoplay)).toHaveBeenCalledWith({
      delay: 10000,
      stopOnInteraction: false,
    });
  });

  test("carousel has correct CSS classes", () => {
    render(<HomeSlider />);
    const section = screen.getByRole("region", {
      name: /Produktkarusell/i,
    });
    expect(section).toHaveClass(
      "border",
      "border-[#1E5BCC]",
      "drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]",
    );
  });

  test("navigation buttons are hidden on small screens", () => {
    render(<HomeSlider />);
    const prevButton = screen.getByTestId("carousel-previous");
    const nextButton = screen.getByTestId("carousel-next");
    expect(prevButton).toHaveClass("hidden", "md:flex");
    expect(nextButton).toHaveClass("hidden", "md:flex");
  });
});
