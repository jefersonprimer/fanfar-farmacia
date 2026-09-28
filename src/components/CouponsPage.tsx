import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_COUPONS, isCouponActive } from '../data/mockCoupons';
import { CATEGORIES } from '../config/pharmacyConfig';
import { formatBRL } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  TicketPercent,
  Copy,
  Check,
  ChevronRight,
  Home,
  Truck,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react';

const formatValidUntil = (iso: string): string =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const daysLeft = (iso: string): number => {
  const diff = new Date(`${iso}T23:59:59`).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};


export const CouponsPage: React.FC = () => {
  const { settings, showToast } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = useMemo(() => MOCK_COUPONS.filter((c) => isCouponActive(c)), []);
  const featured = coupons.filter((c) => c.featured);
  const others = coupons.filter((c) => !c.featured);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast(`Cupom ${code} copiado!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      showToast('Não foi possível copiar. Anote o código!');
    }
  };

  const handleAskCoupon = (code: string) => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Vi o cupom *${code}* no site e gostaria de saber se ainda está válido para o meu pedido.`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  const renderCouponCard = (coupon: (typeof MOCK_COUPONS)[number]) => {
    const categoryNames = coupon.categoryScope
      ?.map((id) => CATEGORIES.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(' · ');

    const remaining = daysLeft(coupon.validUntil);

    const badge =
      coupon.type === 'percent'
        ? `${coupon.value}% OFF`
        : coupon.type === 'fixed'
          ? `${formatBRL(coupon.value)} OFF`
          : 'FRETE GRÁTIS';

    return (
      <article
        key={coupon.id}
        className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
      >
        {/* Coupon stub */}
        <div className="relative bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-4 flex items-center justify-between gap-3">
          <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-white" />
          <div className="absolute -left-2 -bottom-2 w-4 h-4 rounded-full bg-white" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
              <TicketPercent className="w-6 h-6 text-slate-950" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-slate-950 leading-none">{badge}</p>
              <p className="text-[11px] font-semibold text-amber-950/70 mt-1 uppercase tracking-wide">
                {coupon.type === 'shipping' ? 'Tele-entrega' : 'Desconto'}
              </p>
            </div>
          </div>
          {coupon.featured && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-950 bg-white px-2 py-0.5 rounded-md shrink-0">
              Destaque
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-extrabold text-slate-900 leading-snug">{coupon.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{coupon.description}</p>

          {/* Coupon code */}
          <button
            onClick={() => handleCopy(coupon.code)}
            className="mt-4 w-full flex items-center justify-between gap-3 px-3.5 py-2.5 border-2 border-dashed border-amber-400 bg-amber-50/60 rounded-xl transition-colors hover:bg-amber-100/70 cursor-pointer"
            title="Copiar código do cupom"
          >
            <span className="font-mono text-sm font-extrabold tracking-widest text-slate-900 uppercase truncate">
              {coupon.code}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 shrink-0">
              {copiedCode === coupon.code ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar
                </>
              )}
            </span>
          </button>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Válido até {formatValidUntil(coupon.validUntil)}
            </span>
            {remaining <= 15 && (
              <span className="font-bold text-rose-600">
                {remaining === 0 ? 'Último dia!' : `Últimos ${remaining} dias`}
              </span>
            )}
            {coupon.minOrderValue > 0 && (
              <span className="font-medium">Pedido mínimo {formatBRL(coupon.minOrderValue)}</span>
            )}
            {coupon.minOrderValue === 0 && (
              <span className="font-medium">Sem valor mínimo</span>
            )}
            {categoryNames && <span className="font-medium">Departamentos: {categoryNames}</span>}
          </div>

          <ul className="mt-3.5 space-y-1.5 text-[11px] text-slate-500 leading-relaxed">
            {coupon.terms.map((term) => (
              <li key={term} className="flex gap-1.5">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{term}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4">
            <button
              onClick={() => handleAskCoupon(coupon.code)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
              Confirmar cupom no WhatsApp
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="bg-slate-50">
      {/* Banner */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-[11px] text-emerald-300/80 mb-4">
            <Link to="/" className="flex items-center gap-1 hover:text-emerald-200 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Início</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-100 font-semibold">Cupons</span>
          </nav>

          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
            Cupons & Promoções
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Cupons ativos da Fanfar Farmácias
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-2xl leading-relaxed">
            {coupons.length} cupons válidos para economizare na Fanfar Farmácias de Frederico
            Westphalen. Copie o código, adicione os produtos ao carrinho e informe o cupom na
            finalização do pedido.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* How it works */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: '1. Escolha o cupom',
              text: 'Copie o código desejado e confira as regras de validade e valor mínimo.',
            },
            {
              icon: Truck,
              title: '2. Monte seu pedido',
              text: 'Adicione os produtos elegíveis ao carrinho e escolha entrega ou retirada.',
            },
            {
              icon: ShieldCheck,
              title: '3. Confirme no WhatsApp',
              text: 'Informe o cupom na finalização. Nossa equipe confirma o desconto e o estoque.',
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{step.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Cupons em destaque
              </h2>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                {featured.length} cupons
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(renderCouponCard)}
            </div>
          </section>
        )}

        {/* All coupons */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Todos os cupons
              </h2>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                {others.length} cupons
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map(renderCouponCard)}
            </div>
          </section>
        )}

        {/* Rules */}
        <section className="p-5 bg-white border border-slate-200 rounded-2xl">
          <h2 className="text-sm font-extrabold text-slate-900 mb-3">Regras gerais de uso</h2>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              <span>Um cupom por pedido. Cupons não são cumulativos entre si nem com as ofertas do site.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              <span>
                O desconto incide sobre o subtotal dos produtos e não sobre a taxa de entrega, exceto o
                cupom de frete grátis.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              <span>
                Produtos sujeitos a retenção de receita podem não aceitar cupons, conforme a legislação
                vigente e a avaliação do farmacêutico responsável.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              <span>
                Estoque e disponibilidade são confirmados pela equipe da Fanfar Farmácias no momento do
                atendimento. Válido enquanto houver estoque.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
