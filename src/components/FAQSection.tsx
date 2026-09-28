import React, { useState } from 'react';
import { PHARMACY_FAQS } from '../config/pharmacyConfig';
import { useCart } from '../context/CartContext';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FAQSection: React.FC = () => {
  const { settings } = useCart();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleAskWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Tenho uma dúvida sobre pedidos e medicamentos que não encontrei no site.`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="duvidas" className="py-14 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Entenda como funciona o pedido online pelo WhatsApp, entregas em Frederico Westphalen e receitas.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {PHARMACY_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition-colors bg-white shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-emerald-950">Ainda tem alguma pergunta?</h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              Nossa equipe farmacêutica em Frederico Westphalen está pronta para orientar você.
            </p>
          </div>

          <button
            onClick={handleAskWhatsApp}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Falar com o Farmacêutico</span>
          </button>
        </div>
      </div>
    </section>
  );
};
