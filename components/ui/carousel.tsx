"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselRef = UseEmblaCarouselType[0];

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: any;
  orientation?: "horizontal" | "vertical";
}

// Context to share embla instance with child components
const CarouselContext = React.createContext<{
  emblaRef: CarouselRef;
  emblaApi: CarouselApi;
  orientation: "horizontal" | "vertical";
} | null>(null);

const useCarousel = () => {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component");
  }
  return context;
};

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    { orientation = "horizontal", opts, className, children, ...props },
    ref
  ) => {
    const [emblaRef, emblaApi]: [CarouselRef, CarouselApi] = useEmblaCarousel({
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    });
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!emblaApi) return;
      onSelect(emblaApi);
      emblaApi.on("select", onSelect);

      // Cleanup function
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi, onSelect]);

    return (
      <CarouselContext.Provider value={{ emblaRef, emblaApi, orientation }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
          {emblaApi && (
            <>
              <CarouselPrevious
                onClick={() => emblaApi.scrollPrev()}
                disabled={!canScrollPrev}
              />
              <CarouselNext
                onClick={() => emblaApi.scrollNext()}
                disabled={!canScrollNext}
              />
            </>
          )}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { emblaRef, orientation } = useCarousel();

  return (
    <div ref={emblaRef} className="overflow-hidden h-full">
      <div
        ref={ref}
        className={cn(
          "flex h-full",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full h-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, disabled, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn(
      "absolute h-8 w-8 rounded-full z-10",
      "left-2 top-1/2 -translate-y-1/2",
      "bg-white/80 hover:bg-white",
      className
    )}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <ArrowLeft className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </Button>
));
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, disabled, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn(
      "absolute h-8 w-8 rounded-full z-10",
      "right-2 top-1/2 -translate-y-1/2",
      "bg-white/80 hover:bg-white",
      className
    )}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <ArrowRight className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </Button>
));
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
