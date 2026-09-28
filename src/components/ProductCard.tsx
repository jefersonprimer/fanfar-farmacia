import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/pharmacy';
import { useCart } from '../context/CartContext';
import { formatBRL } from '../utils/whatsapp';
import { getProductSlug, getInstallments, isNewProduct } from '../utils/products';
import {
  Plus,
  Trash2,
  Heart,
  Eye,
  FileText,
  Pill,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const {
    addToCart,
    getItemQuantity,
    removeFromCart,
    toggleFavorite,
    isFavorite,
  } = useCart();

  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const quantityInCart = getItemQuantity(product.id);
  const favorite = isFavorite(product.id);
  const isNew = isNewProduct(product);
  const { times: installmentTimes, value: installmentValue } = getInstallments(
    product.price
  );

  const badge = isNew
    ? { label: 'NOVIDADE', tone: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    : product.discount
      ? { label: `-${product.discount}%`, tone: 'bg-amber-100 text-amber-800 border-amber-200' }
      : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromCart(product.id);
  };

  const handleCardClick = () => {
    navigate(`/produto/${getProductSlug(product)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-slate-50/80 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full transition-colors ${
            favorite
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs'
          }`}
          title={favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          aria-label="Favoritar"
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add / Quantity Control */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-1.5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-full border border-slate-200 bg-white/95 p-0.5 shadow-md backdrop-blur-xs"
        >
          <button
            onClick={handleAdd}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition active:scale-90 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
            title="Adicionar ao pedido"
            aria-label="Adicionar ao pedido"
          >
            <Plus className="w-4 h-4" />
          </button>

          {quantityInCart > 0 && (
            <>
              <span className="text-xs font-bold leading-none font-mono tabular-nums text-slate-900">
                {quantityInCart}
              </span>
              <button
                onClick={handleRemove}
                className="flex h-7 w-7 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 active:scale-90"
                title="Remover do pedido"
                aria-label="Remover do pedido"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Prescription Tag */}
        {product.prescriptionRequired && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Retenção de Receita
          </span>
        )}

        {/* Product Image with Fallback Container */}
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <Pill className="w-10 h-10 text-emerald-600/40 mb-2" />
            <span className="text-xs font-medium text-slate-500">{product.name}</span>
            <span className="text-[10px] text-slate-400">{product.brand}</span>
          </div>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pr-8 pointer-events-none">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 text-xs font-semibold shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            Ver detalhes
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1">
        {/* Product Title */}
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Badge */}
        {badge && (
          <span
            className={`mt-2 self-start text-[10px] font-bold uppercase tracking-wide border px-1.5 py-0.5 rounded ${badge.tone}`}
          >
            {badge.label}
          </span>
        )}

        {/* Price Section */}
        <div className="mt-auto pt-3">
          <span className="text-[11px] font-semibold text-emerald-800 tracking-tight uppercase">
            {product.brand}
          </span>
          <div className="mt-1 text-lg font-bold font-mono tabular-nums tracking-tight text-emerald-950">
            {formatBRL(product.price)}
          </div>
          <span className="text-[11px] text-slate-500">
            {installmentTimes}x {formatBRL(installmentValue)} s/ juros
          </span>
        </div>
      </div>
    </div>
  );
};
