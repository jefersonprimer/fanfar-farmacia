import React from 'react';
import { useCart } from '../context/CartContext';
import { formatBRL } from '../utils/whatsapp';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    orderTotal,
    openCheckout,
    settings,
  } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryRemaining = Math.max(0, settings.freeDeliveryThreshold - subtotal);
  const freeDeliveryPercentage = Math.min(100, Math.round((subtotal / settings.freeDeliveryThreshold) * 100));

  const hasPrescriptionItems = items.some((i) => i.product.prescriptionRequired);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Seu Pedido
                </h3>
                <span className="text-xs text-slate-500">
                  {items.length === 0
                    ? 'Carrinho vazio'
                    : `${items.length} ${items.length === 1 ? 'item diferente' : 'itens diferentes'}`}
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-100 text-xs">
              <div className="flex items-center justify-between mb-1.5 text-emerald-900 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  {freeDeliveryRemaining > 0 ? (
                    <span>
                      Faltam <strong className="font-mono">{formatBRL(freeDeliveryRemaining)}</strong> para frete grátis em FW
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-800">
                      🎉 Parabéns! Você ganhou frete grátis em FW!
                    </span>
                  )}
                </span>
                <span className="font-mono font-bold text-[11px]">{freeDeliveryPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Seu carrinho está vazio</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Navegue pelos nossos medicamentos, dermocosméticos e ofertas para adicionar ao seu pedido.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Explorar catálogo de produtos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-3.5 flex gap-3 items-center">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-300 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                        title="Remover produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">{item.product.brand}</p>
                    {item.product.prescriptionRequired && (
                      <span className="text-[10px] text-rose-700 font-medium inline-block">
                        ⚠️ Requer receita médica
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Diminuir"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Aumentar"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                          {formatBRL(item.product.price * item.quantity)}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {item.quantity}x {formatBRL(item.product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Prescription Caution in Cart */}
          {hasPrescriptionItems && (
            <div className="px-5 py-2.5 bg-amber-50 border-t border-b border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Há itens sob retenção de receita no seu pedido. O farmacêutico solicitará a foto da receita via WhatsApp.
              </span>
            </div>
          )}

          {/* Drawer Footer with Totals and Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal dos produtos</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    {formatBRL(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tele-entrega estimada (FW)</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-800">
                    {deliveryFee === 0 ? 'Grátis' : formatBRL(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-950 font-mono tabular-nums">
                      {formatBRL(orderTotal)}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Sujeito à confirmação no WhatsApp
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={openCheckout}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Avançar para o Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={closeCart}
                    className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Continuar comprando
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-800 text-[11px] cursor-pointer"
                  >
                    Esvaziar carrinho
                  </button>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nenhum pagamento é feito no site · Conclusão via WhatsApp</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
