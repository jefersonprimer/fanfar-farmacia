import { Coupon } from '../types/pharmacy';

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'cupom-01',
    code: 'FANFAR20',
    title: '20% OFF em todo o site',
    description:
      'Desconto de 20% em qualquer produto do catálogo, exceto itens já em promoção e medicamentos com retenção de receita.',
    type: 'percent',
    value: 20,
    minOrderValue: 80,
    validUntil: '2026-10-31',
    usageLimit: 300,
    featured: true,
    terms: [
      'Válido para pedidos acima de R$ 80,00.',
      'Não cumulativo com outros cupons ou ofertas do site.',
      'Desconto aplicado no subtotal dos produtos, antes da taxa de entrega.',
    ],
  },
  {
    id: 'cupom-02',
    code: 'PRIMEIRACOMPRA15',
    title: 'R$ 15 OFF na primeira compra',
    description:
      'Cupom de boas-vindas para clientes novos: R$ 15 de desconto em qualquer pedido acima de R$ 50,00.',
    type: 'fixed',
    value: 15,
    minOrderValue: 50,
    validUntil: '2026-12-31',
    usageLimit: 1000,
    terms: [
      'Válido apenas para a primeira compra realizada no site.',
      'Exige pedido mínimo de R$ 50,00.',
      'Não aplicável em conjunto com cupons percentuais.',
    ],
  },
  {
    id: 'cupom-03',
    code: 'FRETEGRATIS',
    title: 'Entrega grátis para todo FW',
    description:
      'Isente a taxa de tele-entrega em qualquer bairro de Frederico Westphalen, sem valor mínimo.',
    type: 'shipping',
    value: 0,
    minOrderValue: 0,
    validUntil: '2026-10-15',
    featured: true,
    terms: [
      'Válido apenas para entregas na cidade de Frederico Westphalen - RS.',
      'Não vale para retirada no balcão.',
      'Sujeito à disponibilidade da rota do dia.',
    ],
  },
  {
    id: 'cupom-04',
    code: 'DERMOCOSMETICOS25',
    title: '25% OFF em Beleza & Dermos',
    description:
      'Seleção completa de dermocosméticos, protetores solares e cuidados capilares com desconto especial.',
    type: 'percent',
    value: 25,
    minOrderValue: 120,
    categoryScope: ['beleza'],
    validUntil: '2026-09-30',
    usageLimit: 150,
    terms: [
      'Válido somente para produtos do departamento Beleza e Cosméticos.',
      'Pedido mínimo de R$ 120,00 no departamento elegível.',
      'Marcas participantes podem variar conforme o estoque da loja.',
    ],
  },
  {
    id: 'cupom-05',
    code: 'MAEBEBE10',
    title: '10% OFF em Mamãe & Bebê',
    description:
      'Fraldas, lenços, fórmulas infantis e produtos de higiene para os pequenos com 10% de desconto.',
    type: 'percent',
    value: 10,
    minOrderValue: 100,
    categoryScope: ['mamae-bebe'],
    validUntil: '2026-10-20',
    usageLimit: 200,
    terms: [
      'Válido somente para produtos do departamento Mamãe e Bebê.',
      'Pedido mínimo de R$ 100,00.',
      'Não cumulativo com a oferta da semana.',
    ],
  },
  {
    id: 'cupom-06',
    code: 'VITAMINAS30',
    title: '30% OFF em Vitaminas e Suplementos',
    description:
      'Multivitamínicos, Fish Oil, Ômega 3, colágeno e minerais com o maior desconto da temporada.',
    type: 'percent',
    value: 30,
    minOrderValue: 90,
    categoryScope: ['vitaminas'],
    validUntil: '2026-09-25',
    usageLimit: 120,
    featured: true,
    terms: [
      'Válido somente para produtos do departamento Vitaminas e Suplementos.',
      'Pedido mínimo de R$ 90,00.',
      'Estoque limitado — confirme disponibilidade no WhatsApp.',
    ],
  },
  {
    id: 'cupom-07',
    code: 'PRIMEIROSSOCORROS12',
    title: '12% OFF em Primeiros Socorros',
    description:
      'Curativos, antissépticos, termômetros e itens de emergência para deixar a casa sempre preparada.',
    type: 'percent',
    value: 12,
    minOrderValue: 0,
    categoryScope: ['primeiros-socorros'],
    validUntil: '2026-11-10',
    usageLimit: 400,
    terms: [
      'Sem valor mínimo de pedido.',
      'Válido apenas para o departamento Primeiros Socorros.',
    ],
  },
  {
    id: 'cupom-08',
    code: 'PERFUMARIA20',
    title: '20% OFF em Perfumaria & Colônias',
    description:
      'Fragrâncias, desodorantes e pós-barba com desconto direto no carrinho, sem precisar ir ao balcão.',
    type: 'percent',
    value: 20,
    minOrderValue: 150,
    categoryScope: ['perfumaria'],
    validUntil: '2026-10-05',
    usageLimit: 180,
    terms: [
      'Válido somente para produtos do departamento Perfumaria e Colônias.',
      'Pedido mínimo de R$ 150,00.',
      'Não cumulativo com cupons de frete grátis.',
    ],
  },
  {
    id: 'cupom-09',
    code: 'SEMANA10',
    title: 'R$ 10 OFF acima de R$ 150',
    description:
      'Desconto direto para compras maiores, válido em qualquer departamento do catálogo.',
    type: 'fixed',
    value: 10,
    minOrderValue: 150,
    validUntil: '2026-09-30',
    usageLimit: 500,
    terms: [
      'Válido em pedidos de R$ 150,00 ou mais.',
      'Um cupom por pedido.',
      'O desconto não se aplica à taxa de entrega.',
    ],
  },
];

export const getCouponByCode = (code: string): Coupon | undefined =>
  MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

export const isCouponActive = (coupon: Coupon, now: Date = new Date()): boolean => {
  if (new Date(coupon.validUntil) < now) return false;
  if (coupon.usageLimit !== undefined && coupon.usageLimit <= 0) return false;
  return true;
};
