import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CATEGORIES, PHARMACY_SERVICES } from '../config/pharmacyConfig';
import { CATALOG_PRODUCTS } from '../data/catalogProducts';
import { Product, ProductCategory } from '../types/pharmacy';
import { ProductCard } from './ProductCard';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useCart } from '../context/CartContext';
import {
  ChevronRight,
  Home,
  ArrowRight,
  Activity,
  Droplet,
  Syringe,
  UserCheck,
  Truck,
  FileText,
  PackageSearch,
  Store,
} from 'lucide-react';

const SERVICE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Droplet,
  Syringe,
  UserCheck,
  Truck,
  FileText,
};

const SERVICES_SLUG = 'servicos';
const BRANDS_SLUG = 'marcas';

const SPECIAL_CATEGORIES: Record<string, { title: string; description: string; matches: (product: Product) => boolean }> = {
  maquiagem: {
    title: 'Maquiagem',
    description: 'Produtos de maquiagem selecionados para completar sua rotina de beleza.',
    matches: (product) => product.category === 'beleza' && (product.subcategory?.toLowerCase().includes('maquiagem') ?? false),
  },
  diabetes: {
    title: 'Diabetes',
    description: 'Aparelhos e itens para monitoramento, sujeitos à disponibilidade da farmácia.',
    matches: (product) => product.sourceCategoryPaths?.some((path) => /diabetes|glicemia/i.test(path)) ?? false,
  },
  cabelos: {
    title: 'Cabelos',
    description: 'Shampoos, condicionadores e tratamentos para sua rotina capilar.',
    matches: (product) => product.sourceCategoryPaths?.some((path) => /cabelo/i.test(path)) ?? false,
  },
  antialergicos: {
    title: 'Antialérgicos',
    description: 'Consulte nossa seleção de produtos para alergias e confirme a orientação adequada com o farmacêutico.',
    matches: (product) => product.sourceCategoryPaths?.some((path) => /antial[eé]rgic/i.test(path)) ?? false,
  },
  antigripais: {
    title: 'Antigripais',
    description: 'Consulte produtos para gripes e resfriados e fale com nossa equipe farmacêutica.',
    matches: (product) => product.sourceCategoryPaths?.some((path) => /gripes|resfriados|antigrip/i.test(path)) ?? false,
  },
};

function buildBrandGroups(): { brand: string; products: Product[] }[] {
  const grouped = new Map<string, Product[]>();

  CATALOG_PRODUCTS.forEach((product) => {
    const list = grouped.get(product.brand) ?? [];
    list.push(product);
    grouped.set(product.brand, list);
  });

  return [...grouped.entries()]
    .map(([brand, products]) => ({ brand, products }))
    .sort((a, b) => b.products.length - a.products.length || a.brand.localeCompare(b.brand));
}

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings, openPrescription } = useCart();

  const brandGroups = useMemo(() => buildBrandGroups(), []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const handleAskService = (serviceTitle: string) => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Gostaria de informações sobre o serviço de "${serviceTitle}". Como funciona?`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  // 404 state for unknown slugs
  if (!slug || (slug !== SERVICES_SLUG && slug !== BRANDS_SLUG && !CATEGORIES.some((c) => c.id === slug) && !SPECIAL_CATEGORIES[slug])) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <PackageSearch className="w-14 h-14 mx-auto text-emerald-600/40 mb-4" />
        <h1 className="text-2xl font-extrabold text-slate-900">Categoria não encontrada</h1>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          O departamento que você procura não existe ou saiu do catálogo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === slug);
  const specialCategory = slug ? SPECIAL_CATEGORIES[slug] : undefined;

  // Services page
  if (slug === SERVICES_SLUG) {
    return (
      <div className="bg-white">
        <PageBanner
          eyebrow="Atenção Farmacêutica em Frederico Westphalen"
          title="Serviços de Saúde & Cuidado Pessoal"
          description="Mais do que uma farmácia, somos um ponto de apoio à saúde da sua família em Frederico Westphalen, com profissionais qualificados e atendimento humanizado."
        />

        <section className="py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PHARMACY_SERVICES.map((srv) => {
                const Icon = SERVICE_ICON_MAP[srv.icon] || Activity;

                return (
                  <div
                    key={srv.id}
                    className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {srv.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                        {srv.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center justify-between">
                      {srv.id === 'receita' ? (
                        <button
                          onClick={openPrescription}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Enviar receita agora</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAskService(srv.title)}
                          className="text-xs font-semibold text-slate-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Consultar no WhatsApp</span>
                        </button>
                      )}

                      <span className="text-[11px] text-slate-400">Balcão FW</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Brands page
  if (slug === BRANDS_SLUG) {
    return (
      <div className="bg-white">
        <PageBanner
          eyebrow="Curadoria da Farmácia"
          title="Nossas Marcas"
          description={`${brandGroups.length} marcas parceiras com produtos selecionados pela nossa equipe farmacêutica em Frederico Westphalen.`}
        />

        <section className="py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {brandGroups.map(({ brand, products }) => (
              <div key={brand}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {brand}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {products.length} {products.length === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Product category page
  const categoryTitle = specialCategory?.title ?? category!.name;
  const categoryDescription = specialCategory?.description ?? category!.description;
  const products = specialCategory
    ? CATALOG_PRODUCTS.filter(specialCategory.matches)
    : CATALOG_PRODUCTS.filter((p) => p.category === (slug as ProductCategory));

  return (
    <div className="bg-white">
      <PageBanner eyebrow="Departamento" title={categoryTitle} description={categoryDescription} />

      <section className="py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{products.length}</span>{' '}
              {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              Ver todos os departamentos
            </button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <PackageSearch className="w-14 h-14 mx-auto text-emerald-600/40 mb-4" />
              <h2 className="text-lg font-bold text-slate-900">Nenhum produto neste departamento</h2>
              <p className="text-sm text-slate-600 mt-1 mb-6">
                Estamos repondo o estoque. Fale com a gente pelo WhatsApp para consultar.
              </p>
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `Olá, Fanfar Farmácias! Gostaria de consultar produtos do departamento "${categoryTitle}".`
                  );
                  window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Consultar disponibilidade
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface PageBannerProps {
  eyebrow: string;
  title: string;
  description: string;
}

const PageBanner: React.FC<PageBannerProps> = ({ eyebrow, title, description }) => (
  <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <nav className="flex items-center gap-1.5 text-[11px] text-emerald-300/80 mb-4">
        <Link to="/" className="flex items-center gap-1 hover:text-emerald-200 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Início</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-100 font-semibold truncate">{title}</span>
      </nav>

      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
        {eyebrow}
      </p>
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
  </section>
);
