import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export const Toast: React.FC = () => {
  const { toastMessage, toastProduct, openCart } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex w-[min(92vw,30rem)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-900 shadow-xl sm:text-sm">
        {toastProduct && (
          <img
            src={toastProduct.image}
            alt={toastProduct.name}
            className="h-20 w-20 shrink-0 rounded-lg bg-white object-contain p-1"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-medium leading-snug text-slate-900">
            {toastProduct?.name ?? toastMessage}
          </p>
          {toastProduct && (
            <span className="mt-0.5 block text-[11px] text-slate-500">
              Adicionado ao carrinho
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
