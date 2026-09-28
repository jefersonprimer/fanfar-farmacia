import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatBRL, buildWhatsAppLink, generateProductInquiryMessage } from '../utils/whatsapp';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  FileText,
  ShieldCheck,
  Truck,
  Heart,
  Pill,
  CheckCircle2,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail: product,
    closeProductDetail,
    addToCart,
    getItemQuantity,
    toggleFavorite,
    isFavorite,
    settings,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const currentCartQty = getItemQuantity(product.id);
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    closeProductDetail();
  };

  const handleAskWhatsApp = () => {
    const message = generateProductInquiryMessage(product, settings);
    const link = buildWhatsAppLink(settings.whatsappNumber, message);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
          </div>

          <button
            onClick={closeProductDetail}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="sm:col-span-5 relative aspect-square bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Pill className="w-12 h-12 text-emerald-600/40 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">{product.name}</span>
                </div>
              )}

              {/* Prescription warning badge */}
              {product.prescriptionRequired && (
                <div className="absolute top-2 left-2 z-10 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                  <FileText className="w-3 h-3" />
                  Retenção de Receita
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                  favorite
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-2xs'
                }`}
                title={favorite ? 'Remover dos favoritos' : 'Favoritar produto'}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Right: Product Info & Pricing */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Apresentação: <strong className="text-slate-700 font-medium">{product.presentation}</strong>
                </p>
                {product.activeIngredient && (
                  <p className="text-xs text-slate-600 mt-1 bg-emerald-50/60 border border-emerald-100 p-2 rounded-lg">
                    <strong className="text-emerald-900 block font-semibold">Princípio Ativo:</strong>
                    {product.activeIngredient}
                  </p>
                )}
              </div>

              {/* Price display */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-mono tabular-nums">
                    {formatBRL(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                      {formatBRL(product.oldPrice)}
                    </span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Em estoque na unidade de Frederico Westphalen</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-800">Descrição:</p>
                <p>{product.description}</p>
                {product.usage && (
                  <p className="pt-1 text-slate-500">
                    <strong className="text-slate-700">Modo de usar:</strong> {product.usage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Prescription Alert Banner */}
          {product.prescriptionRequired && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-semibold block">Aviso sobre Medicamento Sob Prescrição Médica:</strong>
                A dispensação deste medicamento exige apresentação de receita médica válida e
                avaliação do farmacêutico responsável. A disponibilidade e as condições de venda devem
                ser confirmadas com a Fanfar Farmácias.
              </div>
            </div>
          )}

          {/* Delivery & Care Trust Points */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Entrega rápida em Frederico Westphalen</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Procedência e nota fiscal garantidas</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-slate-700">Quantidade:</span>
            <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Diminuir"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center font-mono font-bold text-sm text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Aumentar"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            {currentCartQty > 0 && (
              <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
                ({currentCartQty} já no carrinho)
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAskWhatsApp}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white hover:bg-slate-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
              <span>Tirar Dúvida</span>
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Adicionar ao Pedido ({formatBRL(product.price * quantity)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
