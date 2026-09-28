import { Order, StoreSettings, Product } from '../types/pharmacy';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function buildWhatsAppLink(phoneNumberDigits: string, message: string): string {
  const cleanPhone = phoneNumberDigits.replace(/\D/g, '');
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function generateOrderWhatsAppMessage(order: Order, settings: StoreSettings): string {
  const paymentLabels: Record<string, string> = {
    pix: 'PIX (Chave enviada pela farmácia)',
    credit: 'Cartão de Crédito (Maquininha na entrega/retirada)',
    debit: 'Cartão de Débito (Maquininha na entrega/retirada)',
    cash: 'Dinheiro em Espécie',
  };

  const lines: string[] = [];

  lines.push(`👋 Olá, *${settings.pharmacyName}*! Gostaria de realizar o seguinte pedido:\n`);
  
  lines.push(`📋 *DADOS DO CLIENTE:*`);
  lines.push(`Nome: ${order.customer.name}`);
  lines.push(`WhatsApp: ${formatPhone(order.customer.phone)}`);
  if (order.customer.cpf) {
    lines.push(`CPF (opcional para nota): ${order.customer.cpf}`);
  }
  lines.push('');

  lines.push(`🛍️ *ITENS DO PEDIDO:*`);
  order.items.forEach((item) => {
    const itemSubtotal = item.quantity * item.product.price;
    const rxTag = item.product.prescriptionRequired ? ' ⚠️ [Receita necessária]' : '';
    lines.push(`• ${item.quantity}x ${item.product.name} (${item.product.brand})${rxTag}`);
    lines.push(`  Preço un.: ${formatBRL(item.product.price)} | Subtotal: ${formatBRL(itemSubtotal)}`);
  });
  lines.push('');

  lines.push(`💰 *RESUMO DE VALORES:*`);
  lines.push(`Subtotal dos produtos: ${formatBRL(order.subtotal)}`);
  if (order.delivery.type === 'delivery') {
    lines.push(`Taxa de entrega estimada: ${formatBRL(order.deliveryFee)}`);
  } else {
    lines.push(`Taxa de entrega: Grátis (Retirada na Loja)`);
  }
  lines.push(`*TOTAL ESTIMADO: ${formatBRL(order.total)}*`);
  lines.push('');

  lines.push(`📍 *MODALIDADE DE ENTREGA:*`);
  if (order.delivery.type === 'delivery') {
    lines.push(`Tipo: Tele-Entrega em Frederico Westphalen`);
    lines.push(`Endereço: ${order.delivery.street || ''}, nº ${order.delivery.number || 'S/N'}`);
    if (order.delivery.complement) {
      lines.push(`Complemento: ${order.delivery.complement}`);
    }
    lines.push(`Bairro: ${order.delivery.neighborhood || 'Centro'}`);
    lines.push(`Cidade: ${order.delivery.city || 'Frederico Westphalen'} - RS`);
    if (order.delivery.instructions) {
      lines.push(`Ponto de referência: ${order.delivery.instructions}`);
    }
  } else {
    lines.push(`Tipo: Retirada no balcão da Fanfar Farmácias`);
    lines.push(`Local: ${settings.address}, ${settings.city} - ${settings.state}`);
    if (order.delivery.pickupTime) {
      lines.push(`Previsão de retirada: ${order.delivery.pickupTime}`);
    }
  }
  lines.push('');

  lines.push(`💳 *FORMA DE PAGAMENTO:*`);
  lines.push(`${paymentLabels[order.paymentMethod] || order.paymentMethod}`);
  if (order.notes) {
    lines.push(`Observações adicionais: ${order.notes}`);
  }
  lines.push('');

  lines.push(`_Por favor, confirmem a disponibilidade do estoque, o valor final e o tempo previsto de entrega. Obrigado!_`);

  return lines.join('\n');
}

export function generateProductInquiryMessage(product: Product, settings: StoreSettings): string {
  return `Olá, *${settings.pharmacyName}*! Vi no site o produto *${product.name}* (${product.brand} - ${formatBRL(product.price)}) e gostaria de verificar a disponibilidade e tirar algumas dúvidas. Poderiam me ajudar?`;
}

export function generateGeneralInquiryMessage(settings: StoreSettings): string {
  return `Olá, equipe da *${settings.pharmacyName}*! Gostaria de tirar uma dúvida sobre medicamentos e produtos.`;
}

export function generateMissingProductMessage(term: string, settings: StoreSettings): string {
  return `Olá, *${settings.pharmacyName}*! Busquei no site por "${term}" e não encontrei. Vocês teriam esse item ou similar disponível na loja em Frederico Westphalen?`;
}

export function generatePrescriptionMessage(
  data: {
    customerName: string;
    phone: string;
    medicationsNotes: string;
    deliveryType: 'delivery' | 'pickup';
  },
  settings: StoreSettings
): string {
  const lines: string[] = [];
  lines.push(`📄 Olá, *${settings.pharmacyName}*! Gostaria de enviar uma receita médica para orçamento e verificação.`);
  lines.push('');
  lines.push(`*Nome do Paciente:* ${data.customerName}`);
  lines.push(`*WhatsApp:* ${formatPhone(data.phone)}`);
  lines.push(`*Modalidade desejada:* ${data.deliveryType === 'delivery' ? 'Tele-Entrega em FW' : 'Retirada no Balcão'}`);
  if (data.medicationsNotes) {
    lines.push(`*Anotações / Medicamentos:* ${data.medicationsNotes}`);
  }
  lines.push('');
  lines.push(`_(Estou anexando a foto da receita médica a seguir para conferência do farmacêutico responsável.)_`);
  return lines.join('\n');
}
