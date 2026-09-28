import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PROMO_BANNERS } from '../data/promoBanners';
import { PromoBanner } from '../types/pharmacy';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

export const PromoCarousel: React.FC<{ banners?: PromoBanner[] }> = ({
  banners = PROMO_BANNERS,
}) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const dragStartX = useRef<number | null>(null);

  const total = banners.length;
  const maxIndex = Math.max(0, total - 1);

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(next, maxIndex)));
    },
    [maxIndex]
  );

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isPlaying, maxIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;

    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <section className="pt-8 sm:pt-10 pb-6 sm:pb-7 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative group"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Viewport */}
          <div
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              dragStartX.current = null;
            }}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {banners.map((banner) => (
                <div key={banner.id} className="w-full shrink-0 p-1.5">
                  <a
                    href={banner.href ?? '#catalogo'}
                    onClick={(e) => {
                      if (banner.href) return;
                      e.preventDefault();
                      document
                        .getElementById('catalogo')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="block relative w-full aspect-[16/9] sm:aspect-[1218/276] max-h-[276px] rounded-xl overflow-hidden bg-slate-200"
                    title={banner.title}
                  >
                    <img
                      src={banner.image}
                      alt={banner.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                      <h3 className="text-sm sm:text-lg font-extrabold text-white leading-tight drop-shadow-sm">
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p className="hidden sm:block text-xs text-slate-200 mt-0.5">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={() => goTo(index - 1)}
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-colors cursor-pointer"
                title="Banner anterior"
                aria-label="Banner anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => goTo(index + 1)}
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md transition-colors cursor-pointer"
                title="Próximo banner"
                aria-label="Próximo banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots + Play/Pause */}
          {total > 1 && (
            <div className="absolute bottom-2.5 right-3 sm:bottom-3 sm:right-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {banners.map((banner, dot) => (
                  <button
                    key={banner.id}
                    onClick={() => goTo(dot)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      dot === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90'
                    }`}
                    title={`Ir para o banner ${dot + 1}`}
                    aria-label={`Ir para o banner ${dot + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsPlaying((v) => !v)}
                className="w-7 h-7 rounded-full bg-slate-950/45 hover:bg-slate-950/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? 'Pausar rotação' : 'Retomar rotação'}
                aria-label={isPlaying ? 'Pausar rotação' : 'Retomar rotação'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
