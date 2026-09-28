import React from "react";
import { useCart } from "../context/CartContext";
import { CATALOG_PRODUCTS } from "../data/catalogProducts";
import { ProductCard } from "./ProductCard";
import { Tag, Sparkles, ArrowRight, Percent } from "lucide-react";

export const OffersSection: React.FC = () => {
  const { setSelectedCategory } = useCart();

  const promotionalProducts = CATALOG_PRODUCTS.filter(
    (p) => (p.discount && p.discount > 0) || p.promotional,
  ).slice(0, 4);

  const handleViewAllOffers = () => {
    setSelectedCategory("ofertas");
    const el = document.getElementById("catalogo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Ofertas da Semana · Economize na Fanfar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Cuide de você pagando menos.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Seleção exclusiva de medicamentos, suplementos e cuidados diários
              com até 25% de desconto.
            </p>
          </div>

          <button
            onClick={handleViewAllOffers}
            className="self-start md:self-end px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ver todas as ofertas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {promotionalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
