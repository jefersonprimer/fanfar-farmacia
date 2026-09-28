import catalog from './catalogProducts.json';
import { Product } from '../types/pharmacy';

export const CATALOG_PRODUCTS = catalog as unknown as Product[];
