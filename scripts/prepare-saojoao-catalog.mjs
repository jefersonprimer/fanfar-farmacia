import { readFile, writeFile } from 'node:fs/promises';

const source = JSON.parse(await readFile('data/saojoao-produtos.json', 'utf8'));
const normalize = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const categoryFor = (paths) => {
  const path = normalize(paths.join(' '));
  if (path.includes('medicamento')) return 'medicamentos';
  if (/infantil|gestante|fralda|bebe/.test(path)) return 'mamae-bebe';
  if (/vitamina|suplement|nutricao/.test(path)) return 'vitaminas';
  if (/primeiros socorros|curativo|gaze/.test(path)) return 'primeiros-socorros';
  if (/perfum|colonia|fragrancia/.test(path)) return 'perfumaria';
  if (/beleza|dermocosmetico|cabelo|maquiagem|cosmetico/.test(path)) return 'beleza';
  if (/higiene|banho|saude e bem-estar/.test(path)) return 'higiene';
  return 'outros';
};
const cleanHtml = (value = '') => value
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<\/(p|div|li|h[1-6])\s*>/gi, ' ')
  .replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/\s+/g, ' ')
  .trim();

const products = source.products.map((product) => {
  const paths = product.categories ?? [];
  const item = product.items?.[0];
  const offer = item?.sellers?.[0]?.commertialOffer;
  const price = Number(offer?.Price ?? 0);
  const listPrice = Number(offer?.ListPrice ?? 0);
  const oldPrice = listPrice > price ? listPrice : undefined;
  const name = product.productName || product.productTitle || 'Produto';
  const sku = item?.referenceId?.find((reference) => reference.Key === 'RefId')?.Value
    || item?.ean
    || String(item?.itemId ?? product.productId);
  const normalized = normalize(`${name} ${paths.join(' ')}`);

  return {
    id: `saojoao-${product.productId}`,
    name,
    brand: product.brand || 'Sem marca',
    category: categoryFor(paths),
    subcategory: paths[0]?.split('/').filter(Boolean).at(-1),
    description: cleanHtml(product.description || product.metaTagDescription || name),
    price,
    oldPrice,
    discount: oldPrice ? Math.round((1 - price / oldPrice) * 100) : undefined,
    image: item?.images?.[0]?.imageUrl || '',
    sku,
    activeIngredient: product.properties?.find((property) => /princ[ií]pio ativo|subst[aâ]ncia/i.test(property.name))?.values?.join(', '),
    prescriptionRequired: /antibiot|antimicrob|controlad|tarja preta/.test(normalized),
    available: Boolean(offer?.IsAvailable && (offer?.AvailableQuantity ?? 0) > 0),
    promotional: Boolean(oldPrice),
    presentation: name,
    createdAt: product.releaseDate,
    sourceUrl: product.link,
    sourceCategoryPaths: paths,
  };
});

await writeFile('src/data/catalogProducts.json', `${JSON.stringify(products)}\n`, 'utf8');
console.log(`Catálogo para a loja preparado: ${products.length} produtos`);
