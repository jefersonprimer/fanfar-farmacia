import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  FileText,
  MapPin,
  Clock,
  Settings,
  Heart,
  RotateCcw,
  User,
  ChevronDown,
  CheckCircle2,
  LocateFixed,
  TicketPercent,
} from "lucide-react";
import { formatBRL } from "../utils/whatsapp";
import { searchProducts, getProductSlug } from "../utils/products";
import logoImg from "../assets/images/logo-o-removebg-preview.png";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    totalItemsCount,
    subtotal,
    openCart,
    openPrescription,
    openAdmin,
    openAuth,
    settings,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    showToast,
    favorites,
    pastOrders,
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [cepOpen, setCepOpen] = useState(false);
  const [cep, setCep] = useState("");
  const [locatingCep, setLocatingCep] = useState(false);

  const searchResults = useMemo(
    () => searchProducts(searchQuery),
    [searchQuery],
  );

  const departments: { id: any; label: string }[] = [
    { id: "medicamentos", label: "Medicamentos" },
    { id: "higiene", label: "Higiene e Cuidados" },
    { id: "beleza", label: "Beleza & Dermos" },
    { id: "vitaminas", label: "Vitaminas e Suplementos" },
    { id: "mamae-bebe", label: "Mãe e Bebê" },
    { id: "perfumaria", label: "Perfumaria" },
    { id: "primeiros-socorros", label: "Primeiros Socorros" },
    { id: "ofertas", label: "Ofertas da Semana" },
  ];

  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setCep(
      digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits,
    );
  };

  const handleCepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, "").length === 8) {
      setCepOpen(false);
      showToast(`Entregas disponíveis para o CEP ${cep}`);
    } else {
      showToast("Digite um CEP válido com 8 dígitos.");
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      showToast("Seu navegador não suporta geolocalização.");
      return;
    }

    setLocatingCep(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          if (!response.ok) throw new Error("geocode failed");

          const data = await response.json();
          const postcode: string = data?.address?.postcode ?? "";
          handleCepChange(postcode);

          if (postcode.replace(/\D/g, "").length === 8) {
            setCepOpen(false);
            showToast("CEP preenchido pela sua localização!");
          } else {
            showToast("Não localizamos seu CEP. Digite manualmente.");
          }
        } catch {
          showToast("Não foi possível buscar seu CEP. Digite manualmente.");
        } finally {
          setLocatingCep(false);
        }
      },
      () => {
        setLocatingCep(false);
        showToast("Localização não autorizada. Digite seu CEP.");
      },
      { timeout: 10000 },
    );
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);

    const runScroll = () => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(runScroll, 80);
    } else {
      runScroll();
    }
  };

  const goToCatalog = () => scrollToSection("catalogo");

  const handleNavClick = (sectionId: string, category?: string) => {
    if (category) {
      setSelectedCategory(category as any);
    }
    scrollToSection(sectionId);
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Gostaria de falar com o farmacêutico de plantão.`,
    );
    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${text}`,
      "_blank",
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200 shadow-xs">
      {/* Top micro announcement bar */}
      {settings.isAnnouncementActive && (
        <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 hidden sm:block border-b border-emerald-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-300 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                Frederico Westphalen - RS
              </span>
              <span className="text-emerald-700">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {settings.businessHoursWeekday}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
              <div className="h-4 min-w-0 flex-1 overflow-hidden text-right font-medium" aria-live="polite">
                <div className="announcement-slide-up flex flex-col">
                  <span className="h-4 shrink-0 truncate text-emerald-200">
                    {settings.announcementBanner}
                  </span>
                  <span className="h-4 shrink-0 truncate text-emerald-200">
                    Promoções do dia terminam às 23h59 · confira as ofertas disponíveis
                  </span>
                  <span aria-hidden="true" className="h-4 shrink-0 truncate text-emerald-200">
                    {settings.announcementBanner}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar: Brand + Search + Account + Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* ZONE 1: Brand Logo */}
        <div className="flex items-center shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center group"
            title="Fanfar Farmácias"
          >
            <img
              src={logoImg}
              alt="Fanfar Farmácias"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>
        </div>

        {/* ZONE 2: Search with live product results (fills available width) */}
        <div className="relative hidden lg:block flex-1 min-w-0">
          <input
            type="text"
            placeholder="Buscar remédios, marcas ou princípio ativo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchFocused(false);
            }}
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Limpar busca"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {searchFocused && searchQuery.trim().length >= 2 && (
            <>
              <button
                onClick={() => setSearchFocused(false)}
                className="fixed inset-0 z-40 cursor-default"
                aria-label="Fechar resultados"
                tabIndex={-1}
              />
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                  {searchResults.length > 0 ? (
                    <>
                      <span className="block text-[10px] font-bold text-slate-400 px-4 pt-3 pb-1 uppercase tracking-wider">
                        Resultados
                      </span>
                      <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                        {searchResults.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSearchFocused(false);
                              navigate(`/produto/${getProductSlug(item)}`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 transition-colors"
                          >
                            <div className="w-20 h-20 rounded-xl shrink-0 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] text-slate-500 truncate">
                                {item.brand}
                                {item.prescriptionRequired &&
                                  " · Retenção de receita"}
                              </p>
                              <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                                {item.name}
                              </p>
                              <div className="mt-1 flex items-baseline gap-2 shrink-0">
                                <span className="text-xs font-bold text-emerald-800 font-mono tabular-nums">
                                  {formatBRL(item.price)}
                                </span>
                                {item.oldPrice && (
                                  <span className="text-[10px] text-slate-400 line-through font-mono tabular-nums">
                                    {formatBRL(item.oldPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setSearchFocused(false);
                          goToCatalog();
                        }}
                        className="w-full px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-slate-50 hover:bg-emerald-100/70 border-t border-slate-200 transition-colors"
                      >
                        Ver todos os resultados no catálogo
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-5 text-center">
                      <p className="text-xs text-slate-600">
                        Nenhum produto encontrado para{" "}
                        <strong className="text-slate-800">
                          “{searchQuery}”
                        </strong>
                      </p>
                      <button
                        onClick={() => {
                          setSearchFocused(false);
                          goToCatalog();
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        Consultar disponibilidade no WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ZONE 3: Actions (Mobile search, Account, Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search button on smaller screens */}
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              scrollToSection("catalogo");
            }}
            className="lg:hidden p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Buscar medicamentos"
            aria-label="Buscar produtos"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account */}
          <button
            onClick={() => openAuth("login")}
            className="hidden sm:flex flex-col items-start leading-none gap-1 px-3 py-2 text-left text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-200 transition-colors whitespace-nowrap cursor-pointer"
            title="Entrar ou cadastrar-se"
          >
            <span className="text-[11px] font-medium text-slate-500">
              Bem vindo(a)!
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold">
              <User className="w-4 h-4 text-slate-500" />
              <span>Entrar ou cadastrar-se</span>
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all duration-150 cursor-pointer active:scale-95"
            aria-label={`Carrinho com ${totalItemsCount} itens`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Pedido</span>
            {totalItemsCount > 0 ? (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-amber-400 text-slate-900 rounded-full min-w-5 tabular-nums">
                {totalItemsCount}
              </span>
            ) : (
              <span className="hidden md:inline font-mono tabular-nums text-emerald-200 text-[11px]">
                (0)
              </span>
            )}
            {subtotal > 0 && (
              <span className="hidden lg:inline text-emerald-100 font-mono text-[11px] border-l border-emerald-600/70 pl-2">
                {formatBRL(subtotal)}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Subheader: Departments Menu, CEP & Category Links */}
      <div className="hidden md:block border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-4 lg:gap-6">
          {/* CEP Popover Trigger */}
          <div className="relative shrink-0">
            <button
              onClick={() => setCepOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer py-1"
              aria-expanded={cepOpen}
            >
              {cep ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <MapPin className="w-4 h-4 text-emerald-600" />
              )}
              <span className="whitespace-nowrap">
                {cep ? `CEP: ${cep}` : "Insira o seu CEP"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  cepOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {cepOpen && (
              <>
                <button
                  onClick={() => setCepOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                  aria-label="Fechar"
                  tabIndex={-1}
                />
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        Calcule seu pedido
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Informe seu CEP para verificar prazo e disponibilidade
                        de entrega.
                      </p>
                    </div>

                    <form onSubmit={handleCepSubmit} className="space-y-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        placeholder="00000-000"
                        autoFocus
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 text-xs font-bold uppercase tracking-wide text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                      >
                        Ok
                      </button>
                    </form>

                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-slate-200" />
                      <span className="text-[11px] text-slate-400">ou</span>
                      <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <button
                      onClick={handleUseLocation}
                      disabled={locatingCep}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <LocateFixed
                        className={`w-4 h-4 ${locatingCep ? "animate-spin" : ""}`}
                      />
                      <span>
                        {locatingCep ? "Buscando..." : "Usar minha localização"}
                      </span>
                    </button>

                    {cep && (
                      <button
                        onClick={() => {
                          setCep("");
                          showToast("CEP removido.");
                        }}
                        className="w-full text-[11px] text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Remover CEP
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="h-5 w-px bg-slate-200 shrink-0" />

          {/* Departments Dropdown */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => setDepartmentsOpen(true)}
            onMouseLeave={() => setDepartmentsOpen(false)}
          >
            <button
              onClick={() => setDepartmentsOpen((v) => !v)}
              className="flex items-center gap-1 text-[13px] font-semibold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer py-1"
              aria-expanded={departmentsOpen}
            >
              Departamentos
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  departmentsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {departmentsOpen && (
              <div className="absolute top-full left-0 pt-2 z-50">
                <div className="w-[26rem] rounded-xl bg-white border border-slate-200 shadow-xl p-2 grid grid-cols-2 gap-0.5">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        setSelectedCategory(dept.id);
                        setDepartmentsOpen(false);
                        navigate(`/categoria/${dept.id}`);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="h-5 w-px bg-slate-200 shrink-0" />

          {/* Category Links */}
          <nav className="flex items-center gap-5 lg:gap-7 text-[13px] font-medium text-slate-600 overflow-x-auto">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/cupons");
              }}
              className="hover:text-amber-600 text-amber-700 font-semibold transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Cupons
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/categoria/servicos");
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Serviços de Saúde
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/categoria/marcas");
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Nossas Marcas
            </button>
            <button
              onClick={() => {
                setSelectedCategory("todas");
                scrollToSection("catalogo");
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Produtos Asiáticos
            </button>
            <button
              onClick={() => {
                setSelectedCategory("todas");
                scrollToSection("catalogo");
              }}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap cursor-pointer py-1"
            >
              Novidades
            </button>
          </nav>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50 animate-in fade-in duration-150">
          <div className="relative">
            <input
              type="text"
              placeholder="Digite o nome do remédio, princípio ativo ou marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl">
          <div className="pb-3 border-b border-slate-100">
            <p className="text-xs text-slate-500 mb-1">
              Fanfar Farmácias · Frederico Westphalen
            </p>
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Farmacêutico Online para Atendimento
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuth("login");
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-600" />
              Entrar ou cadastrar
            </button>
            <button
              onClick={() => handleNavClick("catalogo")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <span>Todos os Produtos</span>
            </button>
            <button
              onClick={() => handleNavClick("catalogo", "ofertas")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/70"
            >
              🔥 Ofertas da Semana
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/cupons");
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/70 flex items-center gap-2"
            >
              <TicketPercent className="w-4 h-4" />
              Cupons
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPrescription();
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 col-span-2 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Enviar Receita Médica
              </span>
              <span className="text-[11px] text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-200">
                Orçamento rápido
              </span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/categoria/servicos");
              }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Serviços de Saúde
            </button>
            <button
              onClick={() => handleNavClick("localizacao")}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Onde Estamos (FW)
            </button>
            <button
              onClick={() => handleNavClick("duvidas")}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
            >
              Perguntas Frequentes
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdmin();
              }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Painel do Gerente
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={openWhatsAppDirect}
              className="flex-1 py-2.5 text-center bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chamar no WhatsApp
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="py-2.5 px-4 text-center bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Carrinho ({totalItemsCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
