#!/usr/bin/env node

/**
 * Exporta o catálogo público das Farmácias São João para JSON.
 * O catálogo VTEX mantém muitos dados por SKU (EAN, dimensões, imagens,
 * preço, estoque, especificações etc.); os objetos recebidos são preservados.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BASE_URL = 'https://www.saojoaofarmacias.com.br';
const OUTPUT = resolve(process.argv[2] ?? 'data/saojoao-produtos.json');
const PAGE_SIZE = 50; // limite comum da busca pública VTEX
const MAX_SEARCH_FROM = Number(process.env.SCRAPER_MAX_FROM ?? 200);
const DELAY_MS = Number(process.env.SCRAPER_DELAY_MS ?? 100);
const headers = { 'user-agent': 'Mozilla/5.0 (compatible; CatalogResearch/1.0)' };

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

async function getText(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
  return response.text();
}

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
  return response.json();
}

function productSlug(url) {
  const match = new URL(url).pathname.match(/\/([^/]+)\/p\/?$/i);
  return match?.[1];
}

async function readSitemap(url, visited, productUrls) {
  if (visited.has(url)) return;
  visited.add(url);
  let xml;
  try {
    xml = await getText(url);
  } catch (error) {
    console.warn(`Sitemap indisponível: ${error.message}`);
    return;
  }
  const locs = [...xml.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gis)].map((match) =>
    match[1].replaceAll('&amp;', '&'),
  );
  const children = locs.filter((loc) => /sitemap/i.test(loc) && /\.xml(?:\?|$)/i.test(loc));
  const products = locs.filter((loc) => productSlug(loc));
  products.forEach((loc) => productUrls.add(loc));
  for (const child of children) {
    await sleep(DELAY_MS);
    await readSitemap(child, visited, productUrls);
  }
}

async function main() {
  const products = new Map();
  let apiWorked = false;
  for (let from = 0; from < MAX_SEARCH_FROM; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const url = `${BASE_URL}/api/catalog_system/pub/products/search?_from=${from}&_to=${to}`;
    try {
      const batch = await getJson(url);
      apiWorked = true;
      if (!Array.isArray(batch) || batch.length === 0) break;
      for (const product of batch) {
        const key = String(product.productId ?? product.link ?? product.productName);
        if (key && key !== 'undefined') products.set(key, product);
      }
      console.log(`API catálogo: ${products.size} produtos (offset ${from})`);
      if (batch.length < PAGE_SIZE) break;
    } catch (error) {
      console.warn(`Busca de catálogo parou no offset ${from}: ${error.message}`);
      break;
    }
    await sleep(DELAY_MS);
  }

  const productUrls = new Set();
  const sitemapHosts = [BASE_URL, 'https://lojavtex.saojoaofarmacias.com.br'];
  const visitedSitemaps = new Set();
  for (const host of sitemapHosts) {
    for (const path of ['/sitemap.xml', '/sitemap_index.xml', '/sitemap-index.xml']) {
      await readSitemap(`${host}${path}`, visitedSitemaps, productUrls);
    }
  }
  console.log(`Sitemaps: ${productUrls.size} URLs de produtos encontradas`);

  if (!apiWorked && products.size === 0) {
    throw new Error('Não foi possível acessar a API VTEX nem encontrar produtos pelos sitemaps.');
  }

  const result = {
    source: BASE_URL,
    scrapedAt: new Date().toISOString(),
    count: products.size,
    discovery: {
      catalogApi: apiWorked,
      sitemapProductUrls: productUrls.size,
      catalogApiRange: `0-${MAX_SEARCH_FROM - 1}`,
      note: 'Cada registro mantém a resposta original da API de catálogo, com campos e SKUs disponibilizados publicamente pela loja. A busca pública limita a paginação a offsets até 2500; o sitemap registra URLs publicadas para conferência.',
    },
    products: [...products.values()],
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`Salvos ${products.size} produtos em ${OUTPUT}`);
}

main().catch((error) => {
  console.error(`Falha no scraper: ${error.message}`);
  process.exitCode = 1;
});
