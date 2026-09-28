import { CATALOG_PRODUCTS } from '../data/catalogProducts';
import { Product } from '../types/pharmacy';

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getProductSlug(product: Product): string {
  return `${slugify(product.name)}-${product.id}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG_PRODUCTS.find((product) => getProductSlug(product) === slug);
}

const NEW_PRODUCT_WINDOW_DAYS = 30;

export function isNewProduct(product: Product): boolean {
  if (!product.createdAt) return false;
  const created = new Date(product.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created <= NEW_PRODUCT_WINDOW_DAYS * 86_400_000;
}

export function getInstallments(
  price: number,
  times = 3
): { times: number; value: number } {
  return { times, value: price / times };
}

export function searchProducts(term: string, limit = 6): Product[] {
  const clean = term.trim().toLowerCase();
  if (clean.length < 2) return [];

  return CATALOG_PRODUCTS.filter((product) => {
    const haystack = [
      product.name,
      product.brand,
      product.subcategory,
      product.activeIngredient,
      product.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(clean);
  }).slice(0, limit);
}
