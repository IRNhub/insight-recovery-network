import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  title: string;
  text: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  intervalMs?: number;
}

export function HeroCarousel({ slides, intervalMs = 5500 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setTransitioning(false), 600);
    },
    [transitioning, slides.length]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (paused || prefersReducedMotion.current) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [paused, slides.length, intervalMs]);

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Champagne ambient glow — behind everything */}
      <div
        className="absolute -inset-4 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Second depth layer — offset back panel */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 rounded-2xl bg-primary/10 border border-primary/8" />

      {/* Third layer — thin champagne frame offset */}
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 md:translate-x-2.5 md:translate-y-2.5 rounded-2xl border border-accent/20" />

      {/* Main image card */}
      <div
        className="relative rounded-2xl overflow-hidden bg-secondary shadow-[0_20px_60px_-12px_rgba(22,43,59,0.28),0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ transform: "perspective(1200px) rotateY(-1deg) rotateX(0.5deg)" }}
      >
        {/* Aspect ratio container */}
        <div className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]">
          {slides.map((slide, i) => {
            const isCurrent = i === current;
            const isPrev = i === (current - 1 + slides.length) % slides.length;
            return (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-700 ease-in-out"
                style={{
                  opacity: isCurrent ? 1 : 0,
                  transform: isCurrent
                    ? "translateX(0)"
                    : isPrev
                    ? "translateX(-12px)"
                    : "translateX(12px)",
                  zIndex: isCurrent ? 10 : 0,
                }}
                aria-hidden={!isCurrent}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Gradient vignette — bottom only, for overlay legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />

                {/* Slide overlay card */}
                <div
                  className="absolute bottom-5 left-5 max-w-[240px] rounded-xl p-4 border border-white/10"
                  style={{
                    background: "rgba(22, 43, 59, 0.72)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <div className="w-5 h-px bg-accent mb-2.5" />
                  <p className="font-serif text-primary-foreground text-sm leading-snug mb-1.5">
                    {slide.title}
                  </p>
                  <p className="text-primary-foreground/70 text-xs leading-relaxed font-light">
                    {slide.text}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Inner ring highlight */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none z-20" />

          {/* Prev / Next arrow buttons — subtle, appear on hover */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-primary/40 border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-primary/60 transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-primary/40 border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-primary/60 transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-5" role="tablist" aria-label="Carousel slides">
        {slides.map((slide, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}: ${slide.title}`}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-400 ease-out ${
              i === current
                ? "w-7 h-1.5 bg-accent"
                : "w-1.5 h-1.5 bg-border hover:bg-accent/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
