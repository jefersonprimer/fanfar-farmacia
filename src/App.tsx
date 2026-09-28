import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/Header";
import { QuickCategories } from "./components/QuickCategories";
import { PromoCarousel } from "./components/PromoCarousel";
import { ProductCarousel } from "./components/ProductCarousel";
import { HighlightStrip } from "./components/HighlightStrip";
import { ServicesSection } from "./components/ServicesSection";
import { ReorderSection } from "./components/ReorderSection";
import { LocationSection } from "./components/LocationSection";
import { FAQSection } from "./components/FAQSection";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { ProductPage } from "./components/ProductPage";
import { CategoryPage } from "./components/CategoryPage";
import { CouponsPage } from "./components/CouponsPage";
import { PrescriptionModal } from "./components/PrescriptionModal";
import { AuthModal } from "./components/AuthModal";
import { AdminSettingsModal } from "./components/AdminSettingsModal";
import { LegalModals } from "./components/LegalModals";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { LGPDConsentBanner } from "./components/LGPDConsentBanner";
import { Toast } from "./components/Toast";
import { CATALOG_PRODUCTS } from "./data/catalogProducts";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function HomePage() {
  const byCategory = (...categories: string[]) =>
    CATALOG_PRODUCTS.filter((product) => categories.includes(product.category));
  const inSourceCategory = (pattern: RegExp) =>
    CATALOG_PRODUCTS.filter((product) => product.sourceCategoryPaths?.some((path) => pattern.test(path)));
  const dailyOffers = CATALOG_PRODUCTS.filter(
    (product) => product.promotional && product.discount && !product.prescriptionRequired,
  )
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    .slice(0, 8);
  const babyProducts = CATALOG_PRODUCTS.filter(
    (product) => product.category === "mamae-bebe",
  );
  const familyCare = CATALOG_PRODUCTS.filter(
    (product) =>
      ["beleza", "vitaminas", "higiene"].includes(product.category) &&
      product.promotional &&
      !product.prescriptionRequired,
  )
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    .slice(0, 8);

  return (
    <>
      {/* Atalhos para as principais categorias */}
      <QuickCategories />

      <ProductCarousel
        id="ofertas-do-dia"
        title="Ofertas por tempo limitado"
        products={dailyOffers}
        tone="dark"
        daily
      />

      <ProductCarousel
        id="mae-e-bebe-vitrine"
        title="Tudo para os pequenos"
        description="Fraldas, higiene e itens para acompanhar a rotina de cuidado da família."
        products={babyProducts}
        tone="rose"
      />

      <ProductCarousel
        id="novidades-vitrine"
        title="Novidades na Fanfar"
        description="Conheça os novos itens de beleza, higiene e bem-estar que chegaram ao nosso catálogo."
        products={byCategory(
          "beleza",
          "vitaminas",
        ).sort((a, b) => Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '')).slice(0, 8)}
        tone="light"
      />

      <ProductCarousel
        id="cuidados-familia-vitrine"
        title="Cuidados com você e sua família"
        description="Produtos selecionados para cuidar da pele, da rotina e do bem-estar de quem você ama."
        products={familyCare}
        tone="mint"
      />

      <ProductCarousel
        id="essenciais-vitrine"
        title="Essenciais do dia a dia"
        description="Higiene, proteção e pequenos cuidados que fazem parte da rotina."
        products={byCategory("higiene", "perfumaria", "primeiros-socorros").slice(0, 8)}
        tone="light"
      />

      <ProductCarousel
        id="cabelos-vitrine"
        title="Seu cuidado capilar com desconto"
        description="Shampoo, condicionador e tratamento para montar sua rotina de cuidados com os fios."
        products={inSourceCategory(/cabelo/i).slice(0, 8)}
        tone="mint"
      />

      <ProductCarousel
        id="dermocosmeticos-vitrine"
        title="Dermocosméticos para sua pele"
        description="Limpeza, hidratação e proteção solar para diferentes etapas da sua rotina."
        products={inSourceCategory(/dermocosm[eé]tico|skincare|cuidados faciais/i).slice(0, 8)}
        tone="rose"
      />

      {/* Pharmacy Health Care Services */}
      <ServicesSection />

      {/* Reorder Previous Orders & Saved Favorites */}
      <ReorderSection />

      {/* Physical Store Location & Hours in Frederico Westphalen */}
      <LocationSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
}

export function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <ScrollToTop />

      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PromoCarousel />
                <HighlightStrip />
                <h1 className="sr-only">
                  Fanfar Farmácias — saúde, cuidado e praticidade em Frederico
                  Westphalen
                </h1>
                <HomePage />
              </>
            }
          />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/cupons" element={<CouponsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Drawers, Modals & Floating Affordances */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <PrescriptionModal />
      <AuthModal />
      <AdminSettingsModal />
      <LegalModals />
      <FloatingWhatsApp />
      <LGPDConsentBanner />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
