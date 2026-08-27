import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Product, 
  GameItem, 
  CategoryItem, 
  ProductCategory, 
  TopupTier 
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_GAMES } from '../data/mockTopupGames';
import { INITIAL_EXTENDED_CATEGORIES } from '../data/shopclone7ExtendedData';
import { productsApi } from '../api/products';

interface CatalogContextType {
  products: Product[];
  games: GameItem[];
  categories: CategoryItem[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'popular' | 'price_low' | 'price_high' | 'rating' | 'discount';
  setSortBy: (sort: 'popular' | 'price_low' | 'price_high' | 'rating' | 'discount') => void;
  selectedPlatform: string;
  setSelectedPlatform: (plat: string) => void;
  isLoading: boolean;
  fetchCatalog: () => Promise<void>;
  
  // Product actions
  addNewProduct: (newProduct: Partial<Product>) => Promise<void>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  adjustProductStock: (productId: string, delta: number) => Promise<void>;
  toggleFlashSale: (productId: string, discountPercent?: number, isFlashSale?: boolean, flashSaleData?: Partial<Product>) => void;
  bulkAddStock: (productId: string, rawKeys: string[]) => Promise<{ success: boolean; message: string }>;
  
  // Game actions
  updateGame: (gameId: string, updatedGame: Partial<GameItem>) => void;
  addNewGame: (newGame: Partial<GameItem>) => void;
  deleteGame: (gameId: string) => void;
  addGameTier: (gameId: string, tier: TopupTier) => void;
  updateGameTier: (gameId: string, tierId: string, updatedTier: Partial<TopupTier>) => void;
  deleteGameTier: (gameId: string, tierId: string) => void;
  bulkAdjustGamePrices: (gameId: string, percentDelta: number) => void;

  // Category actions
  addCategory: (cat: Partial<CategoryItem>) => void;
  updateCategory: (catId: string, cat: Partial<CategoryItem>) => void;
  deleteCategory: (catId: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [games, setGames] = useState<GameItem[]>(INITIAL_GAMES);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_EXTENDED_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating' | 'discount'>('popular');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prodRes, gameRes] = await Promise.all([
        productsApi.getProducts(),
        productsApi.getGames()
      ]);

      if (prodRes.success && prodRes.data?.products) {
        setProducts(prodRes.data.products);
        if (prodRes.data.categories && prodRes.data.categories.length > 0) {
          setCategories(prodRes.data.categories);
        }
      }

      if (gameRes.success && gameRes.data?.games) {
        setGames(gameRes.data.games);
      }
    } catch {
      // server sync fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Product Actions
  const addNewProduct = async (newProduct: Partial<Product>) => {
    const prod: Product = {
      id: `prod_${Date.now()}`,
      title: newProduct.title || 'Sản Phẩm Mới',
      subtitle: newProduct.subtitle || 'Bản quyền số chất lượng cao',
      category: newProduct.category || 'ai_tools',
      bannerImg: newProduct.bannerImg || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      platform: newProduct.platform || 'OpenAI',
      retailPrice: newProduct.retailPrice || 99000,
      groupPrice: newProduct.groupPrice || 65000,
      minSlots: newProduct.minSlots || 5,
      deliveryType: newProduct.deliveryType || 'instant_key',
      deliveryEstimate: newProduct.deliveryEstimate || 'Giao ngay lập tức (Auto Key Vault)',
      description: newProduct.description || 'Mô tả chi tiết sản phẩm...',
      features: newProduct.features || ['Bản quyền 100%', 'Bảo hành full thời hạn'],
      instructions: newProduct.instructions || ['Kiểm tra key trong Vault sau khi đặt'],
      seller: newProduct.seller || {
        id: 'seller_main',
        name: 'CyberPool Official',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        badge: 'Cyber Escrow',
        rating: 4.9,
        totalDeals: 12000,
        completedPools: 850,
        responseTime: '1-3 phút'
      },
      tags: newProduct.tags || ['Bestseller', 'Chính Hãng'],
      stockAvailable: newProduct.stockAvailable || 10,
      rating: 5.0,
      reviewCount: 1,
      activePools: newProduct.activePools || []
    };

    setProducts(prev => [prod, ...prev]);

    try {
      await productsApi.createProduct(prod);
    } catch {
      // ignore
    }
  };

  const updateProduct = async (productId: string, updatedData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p));
    try {
      await productsApi.updateProduct(productId, updatedData);
    } catch {}
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await productsApi.deleteProduct(productId);
    } catch {}
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockAvailable: Math.max(0, newStock) } : p));
    try {
      await productsApi.updateProduct(productId, { stockAvailable: Math.max(0, newStock) });
    } catch {}
  };

  const adjustProductStock = async (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStock = Math.max(0, (p.stockAvailable || 0) + delta);
        return { ...p, stockAvailable: nextStock };
      }
      return p;
    }));
  };

  const toggleFlashSale = (productId: string, discountPercent: number = 20, isFlashSale: boolean = true, flashSaleData?: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          isFlashSale,
          discountPercent: isFlashSale ? discountPercent : undefined,
          flashSaleEndsIn: isFlashSale ? '04:15:20' : undefined,
          ...flashSaleData
        };
      }
      return p;
    }));
  };

  const bulkAddStock = async (productId: string, rawKeys: string[]) => {
    const validKeys = rawKeys.filter(k => k.trim().length > 0);
    if (validKeys.length === 0) return { success: false, message: 'Danh sách key trống' };

    try {
      const res = await productsApi.bulkAddStock(productId, validKeys);
      if (res.success && res.data) {
        setProducts(prev => prev.map(p => {
          if (p.id === productId) {
            return { ...p, stockAvailable: (p.stockAvailable || 0) + res.data!.addedCount };
          }
          return p;
        }));
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.error || 'Lỗi nhập kho' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Lỗi mạng' };
    }
  };

  // Game actions
  const updateGame = (gameId: string, updatedGame: Partial<GameItem>) => {
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...updatedGame } : g));
  };

  const addNewGame = (newGame: Partial<GameItem>) => {
    const game: GameItem = {
      id: `game_${Date.now()}`,
      name: newGame.name || 'Game Mới',
      category: newGame.category || 'Mobile',
      publisher: newGame.publisher || 'Nhà phát hành',
      banner: newGame.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      thumbnail: newGame.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80',
      uidLabel: newGame.uidLabel || 'Nhập UID',
      uidPlaceholder: newGame.uidPlaceholder || 'Ví dụ: 801928491',
      description: newGame.description || 'Nạp game tự động',
      tiers: newGame.tiers || []
    };
    setGames(prev => [game, ...prev]);
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
  };

  const addGameTier = (gameId: string, tier: TopupTier) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, tiers: [...g.tiers, tier] };
      }
      return g;
    }));
  };

  const updateGameTier = (gameId: string, tierId: string, updatedTier: Partial<TopupTier>) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        const nextTiers = g.tiers.map(t => t.id === tierId ? { ...t, ...updatedTier } : t);
        return { ...g, tiers: nextTiers };
      }
      return g;
    }));
  };

  const deleteGameTier = (gameId: string, tierId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, tiers: g.tiers.filter(t => t.id !== tierId) };
      }
      return g;
    }));
  };

  const bulkAdjustGamePrices = (gameId: string, percentDelta: number) => {
    const factor = 1 + (percentDelta / 100);
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        const nextTiers = g.tiers.map(t => ({
          ...t,
          retailPrice: Math.round(t.retailPrice * factor / 1000) * 1000,
          groupPrice: t.groupPrice ? Math.round(t.groupPrice * factor / 1000) * 1000 : undefined
        }));
        return { ...g, tiers: nextTiers };
      }
      return g;
    }));
  };

  // Category actions
  const addCategory = (cat: Partial<CategoryItem>) => {
    const newCat: CategoryItem = {
      id: cat.id || `cat_${Date.now()}`,
      name: cat.name || 'Danh mục mới',
      iconName: cat.iconName || 'Zap',
      productCount: cat.productCount || 0,
      orderIndex: cat.orderIndex || 1,
      status: cat.status || 'active',
      slug: cat.slug || 'danh-muc-moi'
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (catId: string, cat: Partial<CategoryItem>) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...cat } : c));
  };

  const deleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        games,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        selectedPlatform,
        setSelectedPlatform,
        isLoading,
        fetchCatalog,
        addNewProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        adjustProductStock,
        toggleFlashSale,
        bulkAddStock,
        updateGame,
        addNewGame,
        deleteGame,
        addGameTier,
        updateGameTier,
        deleteGameTier,
        bulkAdjustGamePrices,
        addCategory,
        updateCategory,
        deleteCategory
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = (): CatalogContextType => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
