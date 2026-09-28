import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Order, PaymentMethod, DeliveryType } from '../types/pharmacy';
import {
  formatBRL,
  buildWhatsAppLink,
  generateOrderWhatsAppMessage,
} from '../utils/whatsapp';
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  MapPin,
  Truck,
  Store,
  Clock,
  ShieldCheck,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const FW_NEIGHBORHOODS = [
  'Centro',
  'Ipiranga',
  'Barril',
  'Itapagé',
  'São Cristóvão',
  'Fátima',
  'Jardim Primavera',
  'Santo Antônio',
  'Aparecida',
  'Distrito Industrial',
  'Outro / Interior de FW',
];

export const CheckoutModal: React.FC = () => {
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    openCart,
    subtotal,
    deliveryFee,
    orderTotal,
    clearCart,
    saveOrder,
    settings,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [instructions, setInstructions] = useState('');
  const [pickupTime, setPickupTime] = useState('Em 30 minutos');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cashChange, setCashChange] = useState('');
  const [notes, setNotes] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');

  if (!isCheckoutOpen) return null;

  // Step 1 Validation
  const validateStep1 = () => {
    if (!customerName.trim() || customerName.trim().length < 3) {
      setValidationError('Por favor, informe seu nome completo.');
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('Por favor, informe um número de WhatsApp válido com DDD (ex: 55 99999-9999).');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (deliveryType === 'delivery') {
      if (!street.trim()) {
        setValidationError('Informe a rua ou avenida para a entrega em Frederico Westphalen.');
        return false;
      }
      if (!number.trim()) {
        setValidationError('Informe o número da residência (ou "S/N").');
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSendOrder = () => {
    const finalFee = deliveryType === 'delivery' ? deliveryFee : 0;
    const finalTotal = subtotal + finalFee;

    const orderData: Order = {
      id: `PED-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('pt-BR'),
      items: [...items],
      customer: {
        name: customerName.trim(),
        phone: phone.trim(),
        cpf: cpf.trim() || undefined,
      },
      delivery: {
        type: deliveryType,
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim(),
        neighborhood,
        city: settings.city,
        zipCode: '98400-000',
        instructions: instructions.trim(),
        pickupTime: deliveryType === 'pickup' ? pickupTime : undefined,
        deliveryFee: finalFee,
      },
      paymentMethod,
      subtotal,
      deliveryFee: finalFee,
      total: finalTotal,
      notes: paymentMethod === 'cash' && cashChange ? `Troco para R$ ${cashChange}. ${notes}` : notes,
    };

    const message = generateOrderWhatsAppMessage(orderData, settings);
    const waUrl = buildWhatsAppLink(settings.whatsappNumber, message);

    saveOrder(orderData);
    setSubmittedOrder(orderData);
    setLastWhatsAppUrl(waUrl);
    setStep(4);
    clearCart();

    // Trigger WhatsApp link directly
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {step === 4 ? 'Pedido Preparado com Sucesso' : 'Finalizar Pedido via WhatsApp'}
            </h3>
            <p className="text-xs text-slate-500">
              Fanfar Farmácias · Frederico Westphalen - RS
            </p>
          </div>

          <button
            onClick={closeCheckout}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (when not in success view) */}
        {step < 4 && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className={step >= 1 ? 'text-emerald-800' : 'text-slate-400'}>
                1. Seus Dados
              </span>
              <span className="text-slate-300">→</span>
              <span className={step >= 2 ? 'text-emerald-800' : 'text-slate-400'}>
                2. Entrega / Retirada
              </span>
              <span className="text-slate-300">→</span>
              <span className={step >= 3 ? 'text-emerald-800' : 'text-slate-400'}>
                3. Pagamento & Envio
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: Customer Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Quem está fazendo o pedido?</h4>
                <p className="text-xs text-slate-500">
                  Precisamos do seu nome e telefone para que o farmacêutico confirme seu pedido no WhatsApp.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Maria dos Santos"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Número do seu WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(55) 99999-9999"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Utilizaremos este número para enviar atualizações da entrega.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CPF (Opcional - caso queira CPF na Nota Fiscal)
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery / Pickup Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Como você prefere receber?</h4>
                <p className="text-xs text-slate-500">
                  Escolha entre receber em casa por tele-entrega ou retirar no balcão da farmácia.
                </p>
              </div>

              {/* Delivery Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    deliveryType === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Truck
                      className={`w-5 h-5 ${
                        deliveryType === 'delivery' ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-mono font-bold text-emerald-900">
                      {deliveryFee === 0 ? 'Grátis' : formatBRL(deliveryFee)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Tele-Entrega em FW
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Entregamos no seu endereço
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    deliveryType === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Store
                      className={`w-5 h-5 ${
                        deliveryType === 'pickup' ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-mono font-bold text-emerald-900">Grátis</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Retirada na Farmácia
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Separamos no balcão em FW
                    </span>
                  </div>
                </button>
              </div>

              {/* Delivery fields */}
              {deliveryType === 'delivery' ? (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Rua / Avenida *
                      </label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Rua do Comércio"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        required
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123 ou S/N"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Complemento (Apto, bloco)
                      </label>
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Ex: Apto 302"
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Bairro em Frederico Westphalen *
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {FW_NEIGHBORHOODS.map((bairro) => (
                          <option key={bairro} value={bairro}>
                            {bairro}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ponto de referência / Instruções para o motoboy
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Ex: Portão cinza ao lado da padaria"
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                /* Pickup fields */
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">{settings.pharmacyName}</strong>
                      <span>{settings.address} - Frederico Westphalen, RS</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Horário de Funcionamento:</strong>
                      <span>{settings.businessHoursWeekday}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Previsão de retirada no balcão:
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 bg-white"
                    >
                      <option value="Em 20 a 30 minutos">Em 20 a 30 minutos</option>
                      <option value="Hoje no período da tarde">Hoje no período da tarde</option>
                      <option value="No final do dia (após as 18h)">No final do dia (após as 18h)</option>
                      <option value="Amanhã pela manhã">Amanhã pela manhã</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Payment Method & Final Review */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Forma de Pagamento</h4>
                <p className="text-xs text-slate-500">
                  O pagamento não é debitado pelo site. Você paga diretamente à farmácia ou na entrega.
                </p>
              </div>

              {/* Payment selector */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">PIX (Chave no WhatsApp)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    paymentMethod === 'credit'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Cartão de Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('debit')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    paymentMethod === 'debit'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Cartão de Débito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Dinheiro em Espécie</span>
                </button>
              </div>

              {/* Cash change field */}
              {paymentMethod === 'cash' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Precisa de troco para quanto?
                  </label>
                  <input
                    type="text"
                    value={cashChange}
                    onChange={(e) => setCashChange(e.target.value)}
                    placeholder="Ex: Troco para R$ 100,00"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 bg-white"
                  />
                </div>
              )}

              {/* Additional notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações adicionais para a farmácia (opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alguma instrução especial sobre marcas genéricas preferidas ou horário de entrega..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 border-b border-emerald-200/80 pb-1.5 flex justify-between">
                  <span>Resumo do Pedido</span>
                  <span className="text-emerald-800 font-mono">{items.length} itens</span>
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 divide-y divide-emerald-100 pr-1">
                  {items.map((it) => (
                    <div key={it.product.id} className="pt-1 flex justify-between text-slate-700">
                      <span className="truncate max-w-[240px]">
                        {it.quantity}x {it.product.name}
                      </span>
                      <span className="font-mono tabular-nums font-medium">
                        {formatBRL(it.product.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold">{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Entrega ({deliveryType === 'delivery' ? 'Frederico Westphalen' : 'Retirada'})</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-800">
                    {deliveryType === 'pickup' || deliveryFee === 0 ? 'Grátis' : formatBRL(deliveryFee)}
                  </span>
                </div>
                <div className="pt-1 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Estimado:</span>
                  <span className="font-mono tabular-nums text-emerald-950 text-base">
                    {formatBRL(subtotal + (deliveryType === 'delivery' ? deliveryFee : 0))}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Ao clicar em <strong>Enviar Pedido pelo WhatsApp</strong>, uma mensagem formatada
                  será aberta diretamente com o WhatsApp da Fanfar Farmácias ({settings.whatsappDisplay}).
                  A equipe confirmará seu pedido imediatamente.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Success Confirmation Screen */}
          {step === 4 && (
            <div className="py-6 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pedido Gerado com Sucesso!</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                  O WhatsApp da Fanfar Farmácias foi aberto com sua lista completa de compras e dados de entrega.
                </p>
              </div>

              {submittedOrder && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-md mx-auto text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800 border-b border-slate-200 pb-1">
                    <span>Protocolo: {submittedOrder.id}</span>
                    <span className="font-mono text-emerald-800">{formatBRL(submittedOrder.total)}</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Cliente:</strong> {submittedOrder.customer.name} ({submittedOrder.customer.phone})
                  </p>
                  <p className="text-slate-600">
                    <strong>Destino:</strong>{' '}
                    {submittedOrder.delivery.type === 'delivery'
                      ? `${submittedOrder.delivery.street}, nº ${submittedOrder.delivery.number} - ${submittedOrder.delivery.neighborhood}`
                      : 'Retirada no balcão da farmácia em Frederico Westphalen'}
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Reabrir WhatsApp da Farmácia</span>
                </a>

                <button
                  onClick={closeCheckout}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Fechar janela
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (steps 1, 2, 3) */}
        {step < 4 && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            {step === 1 ? (
              <button
                type="button"
                onClick={() => {
                  closeCheckout();
                  openCart();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao carrinho</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Avançar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendOrder}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98 animate-pulse hover:animate-none"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Enviar Pedido pelo WhatsApp</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
