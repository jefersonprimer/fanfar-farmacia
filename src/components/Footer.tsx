import React from "react";
import { useCart } from "../context/CartContext";
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  ShieldCheck,
  FileText,
  Heart,
  Settings,
} from "lucide-react";
import logoImg from "../assets/images/logo-o-removebg-preview.png";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const Footer: React.FC = () => {
  const {
    settings,
    openPrescription,
    openAdmin,
    setLegalModal,
    setSelectedCategory,
  } = useCart();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt="Fanfar Farmácias"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Sua farmácia de confiança em Frederico Westphalen - RS. Cuidado,
              atenção farmacêutica de qualidade, medicamentos com procedência
              garantida e a facilidade do pedido direto pelo WhatsApp.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Instagram da Fanfar Farmácias"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                title="WhatsApp Oficial"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("todas");
                    scrollTo("catalogo");
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Todos os Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("medicamentos");
                    scrollTo("catalogo");
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Medicamentos & Genéricos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("ofertas");
                    scrollTo("catalogo");
                  }}
                  className="hover:text-emerald-400 text-amber-400 font-medium transition-colors cursor-pointer"
                >
                  Ofertas da Semana
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("servicos")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Serviços Farmacêuticos
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Atendimento em FW
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}
                  <br />
                  {settings.city} - {settings.state}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p>{settings.businessHoursWeekday}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {settings.businessHoursWeekend}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.whatsappDisplay}</span>
              </div>
            </div>
          </div>

          {/* Legal, Institutional & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Institucional & LGPD
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setLegalModal("privacy")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal("terms")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Termos e Condições de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("duvidas")}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Dúvidas Frequentes (FAQ)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Responsible & Anvisa Disclaimers */}
        <div className="py-6 border-b border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-slate-300">
            <span>Razão Social: Fanfar Farmácias Ltda.</span>
            <span>·</span>
            <span>CNPJ: {settings.cnpj}</span>
            <span>·</span>
            <span>
              Responsável Técnica: {settings.pharmacistResponsible} (
              {settings.crfRs})
            </span>
            <span>·</span>
            <span>{settings.anvisaAfe}</span>
          </div>

          <p>
            <strong>Aviso Legal Regulatório:</strong> As informações contidas
            neste site não devem ser usadas para automedicação e não substituem,
            em hipótese alguma, as orientações dadas pelo médico ou
            farmacêutico. Somente o médico está apto a diagnosticar qualquer
            problema de saúde e prescrever o tratamento adequado. Medicamentos
            sob prescrição médica dependem de retenção de receita para sua
            entrega e dispensação. Preços e disponibilidade de estoque estão
            sujeitos a confirmação final pela farmácia.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            © 2026 {settings.pharmacyName}. Todos os direitos reservados.
            Frederico Westphalen - RS.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Saúde, cuidado e praticidade perto de você
          </p>
        </div>
      </div>
    </footer>
  );
};
