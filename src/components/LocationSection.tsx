import React from 'react';
import { useCart } from '../context/CartContext';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Navigation,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const LocationSection: React.FC = () => {
  const { settings } = useCart();

  const handleDirections = () => {
    // Link oficial da unidade no Google Maps
    window.open('https://maps.app.goo.gl/11lsszxjfb', '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Gostaria de saber como chegar até a farmácia ou tirar dúvidas sobre o horário de atendimento.`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="localizacao" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Nossa Loja Física</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Venha nos Visitar em Frederico Westphalen
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Estamos estrategicamente localizados no centro da cidade, prontos para oferecer acolhimento,
            orientação farmacêutica e o melhor mix de saúde e bem-estar.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Business Details Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Address Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Endereço Principal</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {settings.address}
                    <br />
                    {settings.city} - {settings.state} · CEP 98400-000
                  </p>
                  <button
                    onClick={handleDirections}
                    className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Como chegar pelo Google Maps</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">Horários de Atendimento</h3>
                  <div className="mt-1 space-y-1 text-xs text-slate-600">
                    <p className="flex justify-between">
                      <span className="font-medium">Segunda a Sábado:</span>
                      <span className="font-mono text-slate-900 font-semibold">07:30 às 22:00</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Domingos e Feriados:</span>
                      <span className="font-mono text-slate-900 font-semibold">08:00 às 20:00 (Plantão)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">Canais Oficiais</h3>
                  <div className="mt-2 space-y-2 text-xs">
                    <button
                      onClick={handleWhatsApp}
                      className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp: {settings.whatsappDisplay}</span>
                    </button>

                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                    >
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span>@fanfar_farmacias</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div className="relative h-64 sm:h-80 bg-slate-100">
              <iframe
                title="Mapa da Fanfar Farmácias em Frederico Westphalen - RS"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7086.976084198952!2d-53.396838125149!3d-27.36046971205985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94fb9df35e21839f%3A0x6a92d251ab19dbf2!2sFanfar%20Farm%C3%A1cias!5e0!3m2!1sen!2sbr!4v1790630527511!5m2!1sen!2sbr"
                className="absolute inset-0 h-full w-full border-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Bottom Map Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Estacionamento facilitado e acessibilidade completa</span>
              </div>

              <button
                onClick={handleDirections}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                <span>Traçar rota GPS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
