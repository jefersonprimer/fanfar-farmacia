import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Check } from 'lucide-react';

export const LGPDConsentBanner: React.FC = () => {
  const { setLegalModal } = useCart();
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('fanfar_lgpd_consent');
      if (!consent) {
        setAccepted(false);
      }
    } catch {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('fanfar_lgpd_consent', 'true');
    } catch (e) {
      console.error(e);
    }
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 hidden sm:block" />
          <p>
            Utilizamos cookies essenciais e tratamos dados pessoais estritamente para o processamento de
            pedidos e atendimento pelo WhatsApp em conformidade com a <strong>LGPD</strong>.
            Consulte nossa{' '}
            <button
              onClick={() => setLegalModal('privacy')}
              className="text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer"
            >
              Política de Privacidade
            </button>
            .
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Aceitar e Continuar</span>
        </button>
      </div>
    </div>
  );
};
