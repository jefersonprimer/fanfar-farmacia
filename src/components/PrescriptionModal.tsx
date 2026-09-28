import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { buildWhatsAppLink, generatePrescriptionMessage } from '../utils/whatsapp';
import {
  X,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Camera,
  Trash2,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const PrescriptionModal: React.FC = () => {
  const { isPrescriptionOpen, closePrescription, settings } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [medicationsNotes, setMedicationsNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isPrescriptionOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('O arquivo deve ter no máximo 10MB.');
        return;
      }
      setFileName(file.name);
      setError(null);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFilePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Por favor, informe um telefone de WhatsApp válido.');
      return;
    }

    const message = generatePrescriptionMessage(
      {
        customerName: customerName.trim(),
        phone: phone.trim(),
        medicationsNotes: medicationsNotes.trim(),
        deliveryType,
      },
      settings
    );

    const waUrl = buildWhatsAppLink(settings.whatsappNumber, message);
    window.open(waUrl, '_blank');
    closePrescription();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Enviar Receita Médica</h3>
              <p className="text-xs text-emerald-200">
                Orçamento e conferência farmacêutica em Frederico Westphalen
              </p>
            </div>
          </div>

          <button
            onClick={closePrescription}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Legal / Regulatory disclaimer */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-semibold">Regulamentação Anvisa & CRF/RS:</strong>
              A farmácia não realiza dispensação automática de medicamentos controlados. Toda receita é
              analisada pelo farmacêutico responsável e a via física original deve ser apresentada
              na entrega ou retirada.
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Paciente / Responsável *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp com DDD *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(55) 99999-9999"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferência de recebimento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-2.5 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                    deliveryType === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Tele-Entrega em FW
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-2.5 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                    deliveryType === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Retirar no Balcão
                </button>
              </div>
            </div>

            {/* File Upload Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Foto ou PDF da Receita Médica
              </label>
              {!fileName ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">
                    Tirar foto ou anexar receita
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    JPG, PNG ou PDF até 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Receita preview"
                        className="w-10 h-10 rounded object-cover border border-emerald-200"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-emerald-700 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="text-xs font-semibold text-slate-900 truncate block">
                        {fileName}
                      </span>
                      <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Pronto para envio
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remover anexo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observações ou medicamentos específicos
              </label>
              <textarea
                rows={2}
                value={medicationsNotes}
                onChange={(e) => setMedicationsNotes(e.target.value)}
                placeholder="Ex: Pode orçar também genéricos ou informar caso necessite de posologia para 30 dias..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Enviar Receita para WhatsApp</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Ao abrir o WhatsApp, você poderá enviar a foto diretamente para a farmácia.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
