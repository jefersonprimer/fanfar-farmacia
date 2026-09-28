import React from 'react';
import { useCart } from '../context/CartContext';
import { formatBRL } from '../utils/whatsapp';
import { RotateCcw, ShoppingBag, Clock, Heart, ArrowRight } from 'lucide-react';
import { CATALOG_PRODUCTS } from '../data/catalogProducts';
import { ProductCard } from './ProductCard';

export const ReorderSection: React.FC = () => {
  const { pastOrders, reorderPastOrder, favorites, openCart, setSelectedCategory } = useCart();

  const favoriteProducts = CATALOG_PRODUCTS.filter((p) => favorites.includes(p.id));

  if (pastOrders.length === 0 && favoriteProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Past Orders - Reorder Section */}
        {pastOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Praticidade no seu dia a dia</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Repetir Pedidos Anteriores
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {pastOrders.length} pedido(s) salvo(s)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2 pb-2 border-b border-slate-100">
                      <span className="font-semibold text-slate-800">{order.id}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {order.date}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="text-xs text-slate-600 flex justify-between">
                          <span className="truncate max-w-[200px]">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-mono text-slate-800">
                            {formatBRL(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[11px] text-slate-400 italic">
                          + {order.items.length - 3} outro(s) item(ns)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total do pedido</span>
                      <span className="font-mono text-sm font-bold text-emerald-950">
                        {formatBRL(order.total)}
                      </span>
                    </div>

                    <button
                      onClick={() => reorderPastOrder(order)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pedir Novamente</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Products Section */}
        {favoriteProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-rose-600" />
                  <span>Seus Favoritos</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Medicamentos & Cuidados Salvos
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
