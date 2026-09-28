import React from 'react';
import { Truck, Zap, Store, QrCode } from 'lucide-react';

const HIGHLIGHTS = [
  {
    id: 'frete-gratis',
    icon: Truck,
    title: 'Entrega Grátis',
    description: 'Consulte condições',
  },
  {
    id: 'entrega-rapida',
    icon: Zap,
    title: 'Entrega rápida',
    description: 'Em até 1h',
  },
  {
    id: 'retire-loja',
    icon: Store,
    title: 'Retire na loja',
    description: 'Em até 30 minutos',
  },
  {
    id: 'pague-facil',
    icon: QrCode,
    title: 'Pague Fácil',
    description: 'Com PIX',
  },
];

export const HighlightStrip: React.FC = () => {
  return (
    <section className="pb-10 sm:pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {HIGHLIGHTS.map(({ id, icon: Icon, title, description }) => (
            <div
              key={id}
              className="flex items-center gap-3 px-3.5 sm:px-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-emerald-200 hover:shadow-sm transition-all"
            >
              <span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                  {title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
