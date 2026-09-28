import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types/pharmacy';
import {
  X,
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  Phone,
  Truck,
  Building,
  Bell,
  ShieldCheck,
} from 'lucide-react';

export const AdminSettingsModal: React.FC = () => {
  const { isAdminOpen, closeAdmin, settings, updateSettings, resetSettings, showToast } = useCart();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAdminOpen) return null;

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    showToast('Configurações da farmácia salvas com sucesso!');
    setTimeout(() => {
      setSavedSuccess(false);
      closeAdmin();
    }, 1200);
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações padrão da Fanfar Farmácias?')) {
      resetSettings();
      closeAdmin();
      showToast('Configurações restauradas aos padrões de Frederico Westphalen.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Painel do Proprietário / Farmácia
              </h3>
              <p className="text-xs text-slate-400">
                Ajuste WhatsApp para recebimento de pedidos, taxas de tele-entrega e avisos
              </p>
            </div>
          </div>

          <button
            onClick={closeAdmin}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configurações salvas e aplicadas em tempo real!</span>
            </div>
          )}

          {/* WhatsApp Settings */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp de Recebimento dos Pedidos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número para o Link (apenas dígitos) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="5555999887766"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Ex: 55 + DDD 55 + 9 dígitos
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número para Exibição Visual *
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsappDisplay}
                  onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
                  placeholder="(55) 99988-7766"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delivery & Fees */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Tele-Entrega em Frederico Westphalen</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taxa Padrão de Entrega (R$) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={formData.standardDeliveryFee}
                  onChange={(e) => handleChange('standardDeliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valor Mínimo para Frete Grátis (R$) *
                </label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  required
                  value={formData.freeDeliveryThreshold}
                  onChange={(e) => handleChange('freeDeliveryThreshold', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>Barra de Aviso no Topo</span>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnnouncementActive}
                  onChange={(e) => handleChange('isAnnouncementActive', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Exibir aviso</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Texto do Aviso
              </label>
              <input
                type="text"
                value={formData.announcementBanner}
                onChange={(e) => handleChange('announcementBanner', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Store Location & Regulatory Info */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>Dados da Unidade & Responsabilidade Técnica</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço da Farmácia
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone Fixo
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Farmacêutico(a) Responsável
                </label>
                <input
                  type="text"
                  value={formData.pharmacistResponsible}
                  onChange={(e) => handleChange('pharmacistResponsible', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registro CRF/RS
                </label>
                <input
                  type="text"
                  value={formData.crfRs}
                  onChange={(e) => handleChange('crfRs', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeAdmin}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
