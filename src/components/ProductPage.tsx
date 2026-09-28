import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductBySlug, getProductSlug } from '../utils/products';
import { CATALOG_PRODUCTS } from '../data/catalogProducts';
import { CATEGORIES } from '../config/pharmacyConfig';
import { formatBRL, buildWhatsAppLink, generateProductInquiryMessage } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ProductCard } from './ProductCard';
import {
  Plus,
  Minus,
  ShoppingBag,
  FileText,
  ShieldCheck,
  Truck,
  Heart,
  Pill,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;

  const {
    addToCart,
    getItemQuantity,
    toggleFavorite,
    isFavorite,
    settings,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setImageError(false);
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Pill className="w-14 h-14 mx-auto text-emerald-600/40 mb-4" />
        <h1 className="text-2xl font-extrabold text-slate-900">Produto não encontrado</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          O medicamento que você procura pode ter saído do catálogo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          Voltar para a farmácia
        </Link>
      </div>
    );
  }

  const categoryInfo = CATEGORIES.find((c) => c.id === product.category);
  const related = CATALOG_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const currentCartQty = getItemQuantity(product.id);
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleAskWhatsApp = () => {
    const link = buildWhatsAppLink(settings.whatsappNumber, generateProductInquiryMessage(product, settings));
    window.open(link, '_blank');
  };

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 flex-wrap">
          <Link to="/" className="hover:text-emerald-700 transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to="/"
            className="hover:text-emerald-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              setTimeout(() => {
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
          >
            {categoryInfo?.name || 'Catálogo'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-medium truncate max-w-[16rem] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Product Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Pill className="w-14 h-14 text-emerald-600/40 mb-2" />
                  <span className="text-sm font-semibold text-slate-700 text-center px-4">
                    {product.name}
                  </span>
                </div>
              )}

              {product.prescriptionRequired && (
                <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Retenção de Receita
                </div>
              )}

              <button
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  favorite
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-200'
                }`}
                title={favorite ? 'Remover dos favoritos' : 'Favoritar produto'}
                aria-label="Favoritar"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {product.discount && product.discount > 0 && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium">
                <span className="text-sm font-extrabold text-amber-700">-{product.discount}%</span>
                <span>
                  economies de{' '}
                  {formatBRL((product.oldPrice || product.price) - product.price)} nesta oferta
                </span>
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                <span>{product.brand}</span>
                {product.subcategory && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 normal-case font-medium tracking-normal">
                      {product.subcategory}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Apresentação:{' '}
                <strong className="text-slate-700 font-medium">{product.presentation}</strong>{' '}
                <span className="text-slate-400 font-mono text-xs">· SKU: {product.sku}</span>
              </p>

              {product.activeIngredient && (
                <p className="text-sm text-slate-700 mt-3 bg-emerald-50/70 border border-emerald-100 p-3 rounded-xl">
                  <strong className="text-emerald-900 block font-semibold mb-0.5">
                    Princípio Ativo
                  </strong>
                  {product.activeIngredient}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-mono tabular-nums">
                  {formatBRL(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                    {formatBRL(product.oldPrice)}
                  </span>
                )}
                <span className="text-xs text-slate-500">ou 3x de {formatBRL(product.price / 3)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Em estoque na unidade de Frederico Westphalen</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-600 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-800">Descrição</p>
              <p>{product.description}</p>
              {product.usage && (
                <p className="text-slate-500">
                  <strong className="text-slate-700">Modo de usar:</strong> {product.usage}
                </p>
              )}
            </div>

            {product.prescriptionRequired && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
                <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">
                    Aviso sobre Medicamento Sob Prescrição Médica:
                  </strong>
                  A dispensação deste medicamento exige apresentação de receita médica válida e
                  avaliação do farmacêutico responsável. A disponibilidade e as condições de venda devem
                  ser confirmadas com a Fanfar Farmácias.
                </div>
              </div>
            )}

            {/* Quantity + CTAs */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Quantidade:</span>
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Diminuir"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Aumentar"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {currentCartQty > 0 && (
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ({currentCartQty} já no carrinho)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAskWhatsApp}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white hover:bg-slate-50 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>Tirar Dúvida</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar ({formatBRL(product.price * quantity)})</span>
                </button>
              </div>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Entrega rápida em FW</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Nota fiscal garantida</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                <Pill className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Farmácia responsável</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Quem viu, viu também
              </h2>
              <button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
              >
                Ver catálogo completo
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
