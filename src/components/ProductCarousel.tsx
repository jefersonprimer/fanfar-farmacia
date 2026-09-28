import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { Product } from "../types/pharmacy";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  id: string;
  title: string;
  description?: string;
  products: Product[];
  tone?: "light" | "mint" | "rose" | "dark";
  daily?: boolean;
  discountLabel?: string;
}

function getTimeUntilEndOfDay() {
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  return Math.max(0, end.getTime() - Date.now());
}

function DailyCountdown() {
  const [remaining, setRemaining] = useState(getTimeUntilEndOfDay);

  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(getTimeUntilEndOfDay()),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold tabular-nums text-white ring-1 ring-white/20">
      <Clock3 className="h-3.5 w-3.5 text-amber-300" />
      Termina em {String(hours).padStart(2, "0")}:
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  id,
  title,
  description,
  products,
  tone = "light",
  daily = false,
  discountLabel,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateControls = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanGoBack(track.scrollLeft > 8);
    setCanGoForward(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 8,
    );
  };

  useEffect(() => {
    updateControls();
    window.addEventListener("resize", updateControls);
    return () => window.removeEventListener("resize", updateControls);
  }, [products.length]);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.82,
      behavior: "smooth",
    });
    window.setTimeout(updateControls, 350);
  };

  const maxDiscount = Math.max(
    0,
    ...products.map((product) => product.discount ?? 0),
  );
  const toneClasses = {
    light: "bg-white border-y border-slate-100",
    mint: "bg-emerald-50/70 border-y border-emerald-100",
    rose: "bg-rose-50/60 border-y border-rose-100",
    dark: "bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white",
  };
  const isDark = tone === "dark";

  if (!products.length) return null;

  return (
    <section
      id={id}
      className={`py-9 sm:py-12 ${toneClasses[tone]}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div className="min-w-0">
            <h2
              id={`${id}-title`}
              className={`text-xl font-extrabold tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {title}
              {discountLabel && (
                <span
                  className={`ml-2 inline-flex align-middle rounded-full px-2.5 py-1 text-[11px] font-extrabold ${isDark ? "bg-amber-300 text-emerald-950" : "bg-amber-100 text-amber-900"}`}
                >
                  {discountLabel}
                </span>
              )}
              {!discountLabel && maxDiscount >= 30 && (
                <span
                  className={`ml-2 inline-flex align-middle rounded-full px-2.5 py-1 text-[11px] font-extrabold ${isDark ? "bg-amber-300 text-emerald-950" : "bg-amber-100 text-amber-900"}`}
                >
                  até {maxDiscount}% OFF
                </span>
              )}
            </h2>
            <p
              className={`mt-1 max-w-2xl text-xs leading-relaxed sm:text-sm ${isDark ? "text-emerald-100/80" : "text-slate-600"}`}
            >
              {description}
            </p>
          </div>

          {daily && (
            <div className="hidden shrink-0 sm:block">
              <DailyCountdown />
            </div>
          )}
        </div>

        {daily && (
          <div className="mb-4 sm:hidden">
            <DailyCountdown />
          </div>
        )}

        <div className="relative">
          <div
            ref={trackRef}
            onScroll={updateControls}
            className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-2.5 sm:px-0"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[72vw] max-w-[250px] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/3)] sm:max-w-none lg:w-[calc((100%-1.875rem)/4)] xl:w-[calc((100%-2.5rem)/5)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canGoBack}
            aria-label={`Produtos anteriores: ${title}`}
            className={`absolute -left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition disabled:cursor-not-allowed disabled:opacity-0 sm:flex ${isDark ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canGoForward}
            aria-label={`Próximos produtos: ${title}`}
            className={`absolute -right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition disabled:cursor-not-allowed disabled:opacity-0 sm:flex ${isDark ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"}`}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {daily && (
          <p className="mt-1 text-[10px] text-emerald-100/60">
            Vitrine demonstrativa: confirme preços, prazos e disponibilidade com
            a farmácia antes de divulgar as ofertas.
          </p>
        )}
      </div>
    </section>
  );
};
