import React from 'react';
import { useCart } from '../context/CartContext';
import { X, ShieldCheck, FileCheck } from 'lucide-react';

export const LegalModals: React.FC = () => {
  const { legalModal, setLegalModal, settings } = useCart();

  if (!legalModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              {legalModal === 'privacy'
                ? 'Política de Privacidade e Proteção de Dados (LGPD)'
                : 'Termos de Uso e Condições de Atendimento'}
            </h3>
          </div>

          <button
            onClick={() => setLegalModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
          {legalModal === 'privacy' ? (
            <>
              <p>
                A <strong>{settings.pharmacyName}</strong> (CNPJ: {settings.cnpj}), sediada em Frederico
                Westphalen - RS, tem o compromisso de proteger a privacidade e os dados pessoais de seus
                clientes, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
              </p>

              <h4 className="font-bold text-slate-900 text-sm">1. Coleta e Finalidade dos Dados</h4>
              <p>
                Coletamos exclusivamente as informações estritamente necessárias para o processamento,
                separação e entrega dos pedidos solicitados via WhatsApp: Nome Completo, Telefone/WhatsApp,
                Endereço de Entrega e, facultativamente, o CPF para emissão de Cupom Fiscal Eletrônico (NFC-e).
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Receitas Médicas e Dados de Saúde</h4>
              <p>
                As fotos de prescrições médicas e receitas enviadas pelos usuários são tratadas com sigilo
                profissional e utilizadas unicamente pelo farmacêutico responsável ({settings.pharmacistResponsible} - {settings.crfRs})
                para verificação de dosagem, autenticidade, validade e retenção obrigatória prevista nas normas da Anvisa.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Não Compartilhamento</h4>
              <p>
                A Fanfar Farmácias não vende, não aluga e não compartilha dados de clientes com terceiros para
                fins de marketing ou publicidade. Os dados de entrega são compartilhados unicamente com nossos entregadores
                locais para a realização da tele-entrega em Frederico Westphalen.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Direitos do Titular</h4>
              <p>
                O cliente pode, a qualquer momento, solicitar a confirmação, correção ou exclusão de seus dados
                cadastrais através de nossos canais de atendimento ou pelo WhatsApp oficial {settings.whatsappDisplay}.
              </p>
            </>
          ) : (
            <>
              <p>
                Bem-vindo ao canal digital da <strong>{settings.pharmacyName}</strong>. Este website tem por
                finalidade facilitar a consulta de produtos e a montagem de pedidos com envio humanizado
                pelo WhatsApp para nossa loja em Frederico Westphalen - RS.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">1. Natureza do Serviço e Pré-Orçamento</h4>
              <p>
                A montagem de pedidos no website constitui uma solicitação de pré-orçamento. Os preços, a
                disponibilidade de estoque e as condições finais de entrega ficam expressamente sujeitos à
                confirmação pela equipe da farmácia no momento do atendimento no WhatsApp.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Medicamentos com Retenção de Receita</h4>
              <p>
                Medicamentos controlados (Portaria 344/98 e antimicrobianos RDC 20/2011) não podem ser
                dispensados sem a prévia conferência e retenção da via original física da receita médica.
                A apresentação da receita original é obrigatória no ato da entrega ou retirada.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Não Substituição de Orientação Médica</h4>
              <p>
                O conteúdo informativo deste site não substitui a consulta médica nem o diagnóstico clínico.
                Nunca utilize medicamentos sem a orientação de um médico ou farmacêutico. Em caso de dúvidas,
                consulte nosso profissional responsável.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Jurisdição</h4>
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil, sendo eleito o foro da
                comarca de Frederico Westphalen, Estado do Rio Grande do Sul, para dirimir eventuais controvérsias.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={() => setLegalModal(null)}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
