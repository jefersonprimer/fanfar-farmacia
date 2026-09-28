import React from 'react';
import { PHARMACY_SERVICES } from '../config/pharmacyConfig';
import { useCart } from '../context/CartContext';
import {
  Activity,
  Droplet,
  Syringe,
  UserCheck,
  Truck,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Droplet,
  Syringe,
  UserCheck,
  Truck,
  FileText,
};

export const ServicesSection: React.FC = () => {
  const { settings, openPrescription } = useCart();

  const handleAskService = (serviceTitle: string) => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Gostaria de informações sobre o serviço de "${serviceTitle}". Como funciona?`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="servicos" className="py-14 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <span>Atenção Farmacêutica em Frederico Westphalen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Serviços de Saúde & Cuidado Pessoal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Mais do que uma farmácia, somos um ponto de apoio à saúde da sua família em Frederico
            Westphalen, com profissionais qualificados e atendimento humanizado.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHARMACY_SERVICES.map((srv) => {
            const Icon = ICON_MAP[srv.icon] || Activity;

            return (
              <div
                key={srv.id}
                className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center justify-between">
                  {srv.id === 'receita' ? (
                    <button
                      onClick={openPrescription}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Enviar receita agora</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAskService(srv.title)}
                      className="text-xs font-semibold text-slate-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Consultar no WhatsApp</span>
                    </button>
                  )}

                  <span className="text-[11px] text-slate-400">Balcão FW</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
