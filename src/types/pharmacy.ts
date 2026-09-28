export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  sku: string;
  activeIngredient?: string;
  prescriptionRequired: boolean;
  available: boolean;
  featured?: boolean;
  promotional?: boolean;
  presentation: string; // e.g. "30 comprimidos", "Frasco 200ml", "100g"
  usage?: string; // e.g. "Uso adulto e pediátrico acima de 12 anos"
  createdAt?: string;
  sourceUrl?: string;
  sourceCategoryPaths?: string[];
}

export type ProductCategory =
  | 'medicamentos'
  | 'higiene'
  | 'beleza'
  | 'mamae-bebe'
  | 'vitaminas'
  | 'ofertas'
  | 'perfumaria'
  | 'primeiros-socorros'
  | 'outros';

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  shortName: string;
  description: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryType = 'delivery' | 'pickup';

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';

export interface CustomerData {
  name: string;
  phone: string;
  cpf?: string;
}

export interface DeliveryData {
  type: DeliveryType;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  zipCode?: string;
  instructions?: string;
  pickupTime?: string;
  deliveryFee: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  customer: CustomerData;
  delivery: DeliveryData;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
}

export interface PromoBanner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  alt: string;
  href?: string;
}

export type CouponType = 'percent' | 'fixed' | 'shipping';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: CouponType;
  value: number; // percent: 0-100 | fixed: R$ | shipping: ignored
  minOrderValue: number;
  categoryScope?: ProductCategory[]; // undefined = all departments
  validUntil: string; // ISO date
  usageLimit?: number;
  terms: string[];
  featured?: boolean;
}

export interface StoreSettings {
  pharmacyName: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  whatsappNumber: string; // e.g., "5555999887766" (digits only for wa.me)
  whatsappDisplay: string; // e.g., "(55) 99988-7766"
  instagramUrl: string;
  businessHoursWeekday: string;
  businessHoursWeekend: string;
  pharmacistResponsible: string;
  crfRs: string;
  anvisaAfe: string;
  cnpj: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  announcementBanner: string;
  isAnnouncementActive: boolean;
}
