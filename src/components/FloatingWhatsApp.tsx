import React from "react";
import { useCart } from "../context/CartContext";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useCart();

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, Fanfar Farmácias! Gostaria de falar com o farmacêutico de plantão para tirar dúvidas ou fazer um pedido.`,
    );
    window.open(
      `https://wa.me/${settings.whatsappNumber}?text=${text}`,
      "_blank",
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
      {/* Floating Status Pill */}

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={handleOpenWhatsApp}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Falar com a Fanfar Farmácias no WhatsApp"
        title="Falar no WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </button>
    </div>
  );
};
