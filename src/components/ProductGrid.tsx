import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CATALOG_PRODUCTS } from '../data/catalogProducts';
import { CATEGORIES } from '../config/pharmacyConfig';
import { ProductCard } from './ProductCard';
import { ProductCategory, Product } from '../types/pharmacy';
import {
  SlidersHorizontal,
  X,
  Pill,
  Sparkles,
  ArrowUpDown,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { buildWhatsAppLink, generateMissingProductMessage } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ProductGrid: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterPrescriptionOnly,
    setFilterPrescriptionOnly,
    settings,
  } = useCart();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount' | 'name'>('featured');
  const [filterDiscountOnly, setFilterDiscountOnly] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...CATALOG_PRODUCTS];

    // Category filter
    if (selectedCategory !== 'todas') {
      if (selectedCategory === 'ofertas') {
        list = list.filter((p) => p.promotional || (p.discount && p.discount > 0));
      } else {
        list = list.filter((p) => p.category === selectedCategory);
      }
    }

    // Prescription toggle
    if (filterPrescriptionOnly) {
      list = list.filter((p) => p.prescriptionRequired);
    }

    // Discount only toggle
    if (filterDiscountOnly) {
      list = list.filter((p) => p.discount && p.discount > 0);
    }

    // Search query match across: name, brand, activeIngredient, subcategory, description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.activeIngredient && p.activeIngredient.toLowerCase().includes(q)) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [selectedCategory, filterPrescriptionOnly, filterDiscountOnly, searchQuery, sortBy]);

  const currentCategoryInfo = useMemo(() => {
    if (selectedCategory === 'todas') return null;
    return CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  const handleAskMissingOnWhatsApp = () => {
    const msg = generateMissingProductMessage(searchQuery || 'um produto específico', settings);
    const link = buildWhatsAppLink(settings.whatsappNumber, msg);
    window.open(link, '_blank');
  };

  return (
    <section id="catalogo" className="py-12 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Catálogo Farmacêutico</span>
              <span className="text-slate-300">·</span>
              <span>Frederico Westphalen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentCategoryInfo ? currentCategoryInfo.name : 'Nossos Medicamentos & Produtos'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {currentCategoryInfo
                ? currentCategoryInfo.description
                : 'Pesquise por nome, marca ou princípio ativo e adicione ao seu pedido com facilidade.'}
            </p>
          </div>

          {/* Result counter */}
          <div className="text-xs text-slate-500 font-medium">
            Exibindo <span className="font-bold text-slate-900 font-mono">{filteredProducts.length}</span> produtos
          </div>
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs mb-8 space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Active search term indicator (search happens in the header input) */}
            <div className="flex-1 min-w-0">
              {searchQuery ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Resultados para</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full pl-3 pr-1.5 py-1">
                    “{searchQuery}”
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 rounded-full text-emerald-600 hover:bg-emerald-200/70 transition-colors cursor-pointer"
                      title="Limpar busca"
                      aria-label="Limpar busca"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Use a busca do topo da página para filtrar por remédio, marca ou princípio ativo.
                </p>
              )}
            </div>

            {/* Quick Filters and Sorting */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="discount">Maior Desconto</option>
                  <option value="name">Alfabética (A-Z)</option>
                </select>
              </div>

              {/* Prescription toggle filter */}
              <button
                onClick={() => setFilterPrescriptionOnly(!filterPrescriptionOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  filterPrescriptionOnly
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Com Receita</span>
              </button>

              {/* Discount only toggle filter */}
              <button
                onClick={() => setFilterDiscountOnly(!filterDiscountOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  filterDiscountOnly
                    ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Só Ofertas</span>
              </button>
            </div>
          </div>

          {/* Category Tabs (Segmented control) */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'todas'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Todas as categorias
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search State with WhatsApp inquiry button */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Não encontramos medicamentos ou produtos para "{searchQuery}". Nossa farmácia física
              possui mais de 10.000 itens disponíveis em Frederico Westphalen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleAskMissingOnWhatsApp}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Consultar estoque no WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todas');
                  setFilterPrescriptionOnly(false);
                  setFilterDiscountOnly(false);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        {/* Regulatory / Compliance Notice */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-500 text-xs flex items-start gap-2.5">
          <Pill className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-700">Aviso Farmacêutico Regulatório:</strong> Medicamentos sob
            prescrição médica exigem apresentação da receita no momento da entrega ou retirada, conforme
            determinações da Anvisa e CRF/RS. Os valores e disponibilidade de estoque estão sujeitos a
            confirmação final pela equipe da Fanfar Farmácias.
          </p>
        </div>
      </div>
    </section>
  );
};
