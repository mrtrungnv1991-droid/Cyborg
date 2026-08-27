import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  
  // Product actions
  addNewProduct: (newProduct: Partial<Product>) => void;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  adjustProductStock: (productId: string, delta: number) => void;
  toggleFlashSale: (productId: string, discountPercent?: number, isFlashSale?: boolean, flashSaleData?: Partial<Product>) => void;
  bulkAddStock: (productId: string, rawKeys: string[]) => void;
  
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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_games');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GAMES;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpool_categories');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXTENDED_CATEGORIES;
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating' | 'discount'>('popular');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_games', JSON.stringify(games));
    } catch {}
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberpool_categories', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  // Product Actions
  const addNewProduct = (newProduct: Partial<Product>) => {
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
        rating: 5.0,
        totalDeals: 1200,
        completedPools: 450,
        responseTime: '< 1 phút'
      },
      activePools: newProduct.activePools || [],
      rating: newProduct.rating || 5.0,
      reviewCount: newProduct.reviewCount || 1,
      stockAvailable: newProduct.stockAvailable ?? 50,
      tags: newProduct.tags || ['Hot Deal'],
      discountPercent: newProduct.discountPercent || 0,
      isFlashSale: newProduct.isFlashSale ?? false,
      ...newProduct
    };
    setProducts(prev => [prod, ...prev]);
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedData } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockAvailable: Math.max(0, newStock) } : p));
  };

  const adjustProductStock = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockAvailable: Math.max(0, p.stockAvailable + delta) } : p));
  };

  const toggleFlashSale = (
    productId: string, 
    discountPercent?: number, 
    isFlashSale?: boolean, 
    flashSaleData?: Partial<Product>
  ) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextSaleState = isFlashSale !== undefined ? isFlashSale : !p.isFlashSale;
        const discount = discountPercent !== undefined ? discountPercent : (p.discountPercent || 20);
        return {
          ...p,
          isFlashSale: nextSaleState,
          discountPercent: nextSaleState ? discount : 0,
          ...flashSaleData
        };
      }
      return p;
    }));
  };

  const bulkAddStock = (productId: string, rawKeys: string[]) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stockAvailable: p.stockAvailable + rawKeys.length
        };
      }
      return p;
    }));
  };

  // Game Actions
  const updateGame = (gameId: string, updatedGame: Partial<GameItem>) => {
    setGames(prev => prev.map(g => g.id === gameId ? { ...g, ...updatedGame } : g));
  };

  const addNewGame = (newGame: Partial<GameItem>) => {
    const game: GameItem = {
      id: `game_${Date.now()}`,
      name: newGame.name || 'Game Mới',
      category: newGame.category || 'Mobile',
      publisher: newGame.publisher || 'Nhà phát hành',
      thumbnail: newGame.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
      banner: newGame.banner || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      uidLabel: newGame.uidLabel || 'User ID',
      uidPlaceholder: newGame.uidPlaceholder || 'Nhập UID nhân vật...',
      tiers: newGame.tiers || [],
      description: newGame.description || 'Dịch vụ nạp game giá sỉ...',
      ...newGame
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
        return {
          ...g,
          tiers: g.tiers.map(t => t.id === tierId ? { ...t, ...updatedTier } : t)
        };
      }
      return g;
    }));
  };

  const deleteGameTier = (gameId: string, tierId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          tiers: g.tiers.filter(t => t.id !== tierId)
        };
      }
      return g;
    }));
  };

  const bulkAdjustGamePrices = (gameId: string, percentDelta: number) => {
    const factor = 1 + (percentDelta / 100);
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return {
          ...g,
          tiers: g.tiers.map(t => ({
            ...t,
            retailPrice: Math.round(t.retailPrice * factor),
            groupPrice: Math.round(t.groupPrice * factor)
          }))
        };
      }
      return g;
    }));
  };

  // Category Actions
  const addCategory = (cat: Partial<CategoryItem>) => {
    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      slug: cat.slug || `cat_${Date.now()}`,
      name: cat.name || 'Danh mục mới',
      parentId: cat.parentId || null,
      iconName: cat.iconName || 'Layers',
      productCount: 0,
      orderIndex: (categories.length + 1),
      status: 'active',
      ...cat
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
