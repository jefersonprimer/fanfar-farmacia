import { StoreSettings, CategoryInfo } from '../types/pharmacy';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  pharmacyName: 'Fanfar Farmácias',
  city: 'Frederico Westphalen',
  state: 'RS',
  address: 'Rua do Comércio, 480 - Centro',
  phone: '(55) 3744-1234',
  whatsappNumber: '5555999887766', // Clean digits for WhatsApp link
  whatsappDisplay: '(55) 99988-7766',
  instagramUrl: 'https://www.instagram.com/fanfar_farmacias',
  businessHoursWeekday: 'Segunda a Sábado: 07:30 às 22:00',
  businessHoursWeekend: 'Domingos e Feriados: 08:00 às 20:00 (Plantão)',
  pharmacistResponsible: 'Dra. Gabriela Fanfar - Farmacêutica',
  crfRs: 'CRF/RS 18.492',
  anvisaAfe: 'AFE: 7.82.910-4',
  cnpj: '38.452.190/0001-44',
  standardDeliveryFee: 6.00,
  freeDeliveryThreshold: 80.00,
  announcementBanner: '🛵 Entregas rápidas em toda Frederico Westphalen! Peça com facilidade pelo WhatsApp.',
  isAnnouncementActive: true,
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'medicamentos',
    name: 'Medicamentos',
    shortName: 'Medicamentos',
    description: 'Analgésicos, antialérgicos, digestivos e genéricos de confiança.',
    icon: 'Pill',
  },
  {
    id: 'higiene',
    name: 'Higiene e Cuidados',
    shortName: 'Higiene',
    description: 'Higiene bucal, banho, cuidados corporais e curativos diários.',
    icon: 'Sparkles',
  },
  {
    id: 'beleza',
    name: 'Beleza e Cosméticos',
    shortName: 'Beleza & Dermos',
    description: 'Skincare, proteção solar, dermocosméticos e cuidados capilares.',
    icon: 'Heart',
  },
  {
    id: 'vitaminas',
    name: 'Vitaminas e Suplementos',
    shortName: 'Vitaminas',
    description: 'Multivitamínicos, imunidade, colágeno, ômega 3 e minerais.',
    icon: 'ShieldCheck',
  },
  {
    id: 'mamae-bebe',
    name: 'Mamãe e Bebê',
    shortName: 'Mamãe & Bebê',
    description: 'Fraldas, fórmulas infantis, lenços umedecidos e pomadas.',
    icon: 'Baby',
  },
  {
    id: 'ofertas',
    name: 'Ofertas da Semana',
    shortName: 'Ofertas',
    description: 'Produtos selecionados com preços especiais para economizar.',
    icon: 'Tag',
  },
  {
    id: 'perfumaria',
    name: 'Perfumaria & Colônias',
    shortName: 'Perfumaria',
    description: 'Desodorantes, colônias, pós-barba e fragrâncias.',
    icon: 'Flower2',
  },
  {
    id: 'primeiros-socorros',
    name: 'Primeiros Socorros',
    shortName: 'Socorros & Curativos',
    description: 'Termômetros, gazes, esparadrapos, antissépticos e álcool 70%.',
    icon: 'Cross',
  },
  {
    id: 'outros',
    name: 'Outros produtos',
    shortName: 'Outros',
    description: 'Itens diversos disponíveis no catálogo da loja.',
    icon: 'Package',
  },
];

export const PHARMACY_SERVICES = [
  {
    id: 'pressao',
    title: 'Aferição de Pressão Arterial',
    description: 'Controle regular da pressão com registro e acompanhamento de parâmetros cardiovasculares.',
    icon: 'Activity',
    badge: 'Disponível na loja',
  },
  {
    id: 'glicemia',
    title: 'Teste de Glicemia Capilar',
    description: 'Medição rápida e segura do nível de glicose para suporte ao paciente diabético.',
    icon: 'Droplet',
    badge: 'Resultado imediato',
  },
  {
    id: 'injetaveis',
    title: 'Aplicação de Injetáveis',
    description: 'Administração profissional de medicamentos injetáveis mediante apresentação de receita médica.',
    icon: 'Syringe',
    badge: 'Com receita médica',
  },
  {
    id: 'orientacao',
    title: 'Orientação Farmacêutica',
    description: 'Tire dúvidas sobre horários, interações medicamentosas e conservação correta de remédios.',
    icon: 'UserCheck',
    badge: 'Atendimento humanizado',
  },
  {
    id: 'tele-entrega',
    title: 'Tele-Entrega Rápida em FW',
    description: 'Receba seus medicamentos e produtos com comodidade no conforto da sua casa ou trabalho.',
    icon: 'Truck',
    badge: 'Frederico Westphalen - RS',
  },
  {
    id: 'receita',
    title: 'Análise de Receita Médica',
    description: 'Envie foto da receita antes de sair de casa para verificação prévia de estoque e orçamento.',
    icon: 'FileText',
    badge: 'Via WhatsApp',
  },
];

export const PHARMACY_FAQS = [
  {
    question: 'Como faço para pedir pelo WhatsApp?',
    answer:
      'É muito simples: basta navegar pelo site, adicionar os produtos desejados ao carrinho e clicar em "Finalizar Pedido via WhatsApp". O site irá formatar automaticamente toda a lista com produtos, quantidades, seu endereço e método de pagamento escolhido. Ao abrir o WhatsApp, é só apertar Enviar!',
  },
  {
    question: 'Vocês realizam entregas em Frederico Westphalen?',
    answer:
      'Sim! Fazemos entregas em todos os bairros de Frederico Westphalen e regiões próximas com agilidade e cuidado no transporte dos medicamentos.',
  },
  {
    question: 'Como funciona o valor da tele-entrega?',
    answer:
      'A taxa de tele-entrega padrão em Frederico Westphalen é a partir de R$ 6,00. Em pedidos acima de R$ 80,00, a entrega pode ser gratuita para bairros centrais! A taxa exata é confirmada na finalização com a equipe da farmácia.',
  },
  {
    question: 'Posso retirar meu pedido diretamente na farmácia?',
    answer:
      'Com certeza! Na hora do pedido, escolha a opção "Retirada na Farmácia". Separamos seus produtos e enviamos uma mensagem avisando assim que o pacote estiver pronto no balcão.',
  },
  {
    question: 'Como funciona a compra de medicamentos controlados ou com receita?',
    answer:
      'Para medicamentos sob prescrição, você pode enviar a foto legível da receita médica pelo nosso site ou direto pelo WhatsApp. Nosso farmacêutico fará a conferência da dosagem, validade e retenção conforme as normas da Anvisa e CRF/RS. No momento da entrega ou retirada, a via original física deverá ser apresentada.',
  },
  {
    question: 'Os preços no site são finais?',
    answer:
      'Os preços e a disponibilidade de estoque são constantemente atualizados, porém ficam sempre sujeitos à confirmação final pela equipe da Fanfar Farmácias no momento do atendimento no WhatsApp.',
  },
  {
    question: 'Quais são as formas de pagamento aceitas?',
    answer:
      'Aceitamos PIX (chave enviada pelo WhatsApp), Cartão de Crédito ou Débito (o entregador leva a maquininha sem fio até você) e Dinheiro em espécie (basta informar se precisa de troco).',
  },
  {
    question: 'Qual é o horário de atendimento da farmácia?',
    answer:
      'Atendemos de Segunda a Sábado das 07:30 às 22:00. Aos Domingos e Feriados atendemos das 08:00 às 20:00 ou conforme a escala oficial de plantão farmacêutico de Frederico Westphalen.',
  },
];
