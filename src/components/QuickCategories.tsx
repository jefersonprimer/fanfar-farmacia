import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategorySlide {
  name: string;
  image: string;
  slug: string;
}

const CATEGORY_SLIDES: CategorySlide[] = [
  {
    name: "Infantil",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_0/mrtk246825h6jc.webp",
    slug: "mamae-bebe",
  },
  {
    name: "JK-Beauty",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_1/mobile/20260828155500_6a94bf7eb9e6fb6d31eceae4_1/mtk6yee0cbmgl9.webp",
    slug: "beleza",
  },
  {
    name: "Higiene",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_2/mrtk2468y1j59l.webp",
    slug: "higiene",
  },
  {
    name: "Suplementos",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_2/all/20260720153500_6a5e6838d200f902c3f45a73_8/msxmg74ca5z528.webp",
    slug: "vitaminas",
  },
  {
    name: "Maquiagem",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_3/mrtk2468g9dhmo.webp",
    slug: "maquiagem",
  },
  {
    name: "Diabetes",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_1/desktop/20260921152000_6ab1754ab9e6fb6d31eceb9a_0/mucxu52d6obdh0.webp",
    slug: "diabetes",
  },
  {
    name: "Cabelos",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_5/mrtk2468iya76z.webp",
    slug: "cabelos",
  },
  {
    name: "Antialérgicos",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_4/mrtk2468464u9r.webp",
    slug: "antialergicos",
  },
  {
    name: "Antigripais",
    image:
      "https://cdn1.staticpanvel.com.br/cdn_service/banners/home/promotional_3/all/20260720153500_6a35a4c6c6a9734f6559becd_6/mrtk24688hrl06.webp",
    slug: "antigripais",
  },
];

export const QuickCategories: React.FC = () => {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

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
  }, []);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.75,
      behavior: "smooth",
    });
    window.setTimeout(updateControls, 350);
  };

  const handleCategorySelect = (slide: CategorySlide) => {
    navigate(`/categoria/${slide.slug}`);
  };

  return (
    <section
      className="border-b border-slate-200 bg-white py-7 sm:py-9"
      aria-labelledby="quick-categories-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="quick-categories-title"
              className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg"
            >
              Explore por categoria
            </h2>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canGoBack}
              aria-label="Categorias anteriores"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canGoForward}
              aria-label="Próximas categorias"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onScroll={updateControls}
          className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-2.5 sm:px-0"
        >
          {CATEGORY_SLIDES.map((slide) => (
            <button
              key={slide.name}
              type="button"
              onClick={() => handleCategorySelect(slide)}
              className="group w-[112px] shrink-0 snap-start text-left sm:w-[132px] lg:w-[144px]"
            >
              <span className="block aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-emerald-300 group-hover:shadow-md">
                <img
                  src={slide.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="mt-2 block truncate text-center text-xs font-bold text-slate-700 transition-colors group-hover:text-emerald-800 sm:text-sm">
                {slide.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
