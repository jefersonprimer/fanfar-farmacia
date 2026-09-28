import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem, Order, StoreSettings, ProductCategory } from '../types/pharmacy';
import { DEFAULT_STORE_SETTINGS } from '../config/pharmacyConfig';
import { CATALOG_PRODUCTS } from '../data/catalogProducts';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  orderTotal: number;
  
  // UI Drawers & Modals
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  isPrescriptionOpen: boolean;
  openPrescription: () => void;
  closePrescription: () => void;

  selectedProductForDetail: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;

  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;

  authModal: 'login' | 'register' | null;
  openAuth: (mode?: 'login' | 'register') => void;
  closeAuth: () => void;
  setAuthMode: (mode: 'login' | 'register') => void;

  legalModal: 'privacy' | 'terms' | null;
  setLegalModal: (modal: 'privacy' | 'terms' | null) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Recent Orders (for Reorder)
  pastOrders: Order[];
  saveOrder: (order: Order) => void;
  reorderPastOrder: (order: Order) => void;

  // Recently Viewed Products
  recentlyViewed: Product[];
  recordProductView: (product: Product) => void;

  // Filters & Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'todas';
  setSelectedCategory: (cat: ProductCategory | 'todas') => void;
  filterPrescriptionOnly: boolean;
  setFilterPrescriptionOnly: (val: boolean) => void;

  // Store Settings (editable by owner)
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettings: () => void;

  // Notification / Toast
  toastMessage: string | null;
  toastProduct: Product | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Cart Items with localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('fanfar_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fanfar_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // 2. Settings with localStorage
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem('fanfar_store_settings');
      return stored ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(stored) } : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('fanfar_store_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    localStorage.removeItem('fanfar_store_settings');
  };

  // 3. Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fanfar_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('fanfar_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // 4. Past Orders (Reorder)
  const [pastOrders, setPastOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('fanfar_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveOrder = (order: Order) => {
    setPastOrders((prev) => {
      const next = [order, ...prev.slice(0, 9)]; // keep last 10 orders
      localStorage.setItem('fanfar_orders', JSON.stringify(next));
      return next;
    });
  };

  const reorderPastOrder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    openCart();
    showToast('Produtos do pedido anterior adicionados ao carrinho!');
  };

  // 5. Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('fanfar_recent_views');
      if (!stored) return [];
      const ids: string[] = JSON.parse(stored);
      return ids.map((id) => CATALOG_PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[];
    } catch {
      return [];
    }
  });

  const recordProductView = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const next = [product, ...filtered].slice(0, 6);
      localStorage.setItem('fanfar_recent_views', JSON.stringify(next.map((p) => p.id)));
      return next;
    });
  };

  // 6. Navigation / Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas');
  const [filterPrescriptionOnly, setFilterPrescriptionOnly] = useState(false);

  // 7. Modals / Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // 8. Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastProduct, setToastProduct] = useState<Product | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastProduct(null);
    setTimeout(() => {
      setToastMessage(null);
      setToastProduct(null);
    }, 2800);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setToastMessage(`"${product.name}" adicionado ao carrinho!`);
    setToastProduct(product);
    setTimeout(() => {
      setToastMessage(null);
      setToastProduct(null);
    }, 2800);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const getItemQuantity = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= settings.freeDeliveryThreshold) return 0;
    return settings.standardDeliveryFee;
  }, [subtotal, settings]);

  const orderTotal = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openPrescription = () => setIsPrescriptionOpen(true);
  const closePrescription = () => setIsPrescriptionOpen(false);

  const openProductDetail = (product: Product) => {
    setSelectedProductForDetail(product);
    recordProductView(product);
  };
  const closeProductDetail = () => setSelectedProductForDetail(null);

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const openAuth = (mode: 'login' | 'register' = 'login') => setAuthModal(mode);
  const closeAuth = () => setAuthModal(null);
  const setAuthMode = (mode: 'login' | 'register') => setAuthModal(mode);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItemsCount,
        subtotal,
        deliveryFee,
        orderTotal,

        isCartOpen,
        openCart,
        closeCart,

        isCheckoutOpen,
        openCheckout,
        closeCheckout,

        isPrescriptionOpen,
        openPrescription,
        closePrescription,

        selectedProductForDetail,
        openProductDetail,
        closeProductDetail,

        isAdminOpen,
        openAdmin,
        closeAdmin,

        authModal,
        openAuth,
        closeAuth,
        setAuthMode,

        legalModal,
        setLegalModal,

        favorites,
        toggleFavorite,
        isFavorite,

        pastOrders,
        saveOrder,
        reorderPastOrder,

        recentlyViewed,
        recordProductView,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filterPrescriptionOnly,
        setFilterPrescriptionOnly,

        settings,
        updateSettings,
        resetSettings,

        toastMessage,
        toastProduct,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
