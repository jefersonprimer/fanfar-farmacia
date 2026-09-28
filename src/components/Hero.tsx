import React from "react";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  HeartPulse,
  Clock,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import heroImage from "../assets/images/hero_pharmacy_banner_1790624278883.jpg";

export const Hero: React.FC = () => {
  const { settings, openPrescription } = useCart();

  const handleBuyNow = () => {
    const el = document.getElementById("catalogo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleWhatsAppHero = () => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Gostaria de consultar medicamentos e fazer um pedido com vocês.`,
    );
    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${text}`,
      "_blank",
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900/5 via-slate-50 to-white pt-6 pb-12 sm:pb-16 lg:pb-20 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Kicker - Zero pill: clean unboxed metadata with bullet */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-emerald-800 tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Farmácia em Frederico Westphalen · RS
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-600 font-medium">
                Atendimento humanizado
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
              Saúde, cuidado e praticidade{" "}
              <span className="text-emerald-700 underline decoration-emerald-200 decoration-wavy decoration-2">
                perto de você.
              </span>
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Encontre seus medicamentos e itens de cuidado diário, monte seu
              carrinho sem complicações e finalize seu pedido diretamente pelo{" "}
              <strong className="text-slate-900 font-semibold">
                WhatsApp da Fanfar Farmácias
              </strong>
              . Rápido, seguro e com a conferência profissional da nossa equipe.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleBuyNow}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-800/20 hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar agora</span>
              </button>

              <button
                onClick={handleWhatsAppHero}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-emerald-900 font-semibold text-sm rounded-xl border border-emerald-300 shadow-xs hover:border-emerald-400 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                <span>Falar no WhatsApp</span>
              </button>
            </div>

            {/* Trust Signals */}
            <div className="pt-4 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Tele-Entrega em FW
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Entrega ágil em bairros de FW
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Farmacêutico Responsável
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Orientação profissional segura
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Pague na Entrega ou Retirada
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    PIX, cartão ou dinheiro
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Branded Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 bg-white">
              {/* Pharmacy Hero Image */}
              <div className="aspect-[4/3] sm:aspect-[16/11] relative bg-slate-100 overflow-hidden">
                <img
                  src={heroImage}
                  alt="Fanfar Farmácias - Farmácia moderna em Frederico Westphalen"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

                {/* Overlay Badge at bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cuidado Farmacêutico Genuíno</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                    Fanfar Farmácias · Frederico Westphalen
                  </h3>
                  <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {settings.businessHoursWeekday}
                  </p>
                </div>
              </div>

              {/* Floating feature ticker */}
              <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-emerald-300 font-bold block">
                    WhatsApp Oficial:
                  </span>
                  <span className="font-mono text-sm tracking-wide text-white">
                    {settings.whatsappDisplay}
                  </span>
                </div>
                <button
                  onClick={handleWhatsAppHero}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors text-xs whitespace-nowrap cursor-pointer"
                >
                  Enviar Mensagem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
