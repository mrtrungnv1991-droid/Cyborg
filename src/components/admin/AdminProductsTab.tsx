import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Flame, 
  Edit3, 
  Copy, 
  UploadCloud, 
  Trash2, 
  Check, 
  X,
  Plus,
  Minus
} from 'lucide-react';
import { Product, ProductCategory, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AdminProductsTabProps {
  products: Product[];
  currency: CurrencyCode;
  onAddNewProduct: (newProduct: Partial<Product>) => void;
  onUpdateProduct?: (productId: string, updatedData: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onAdjustProductStock?: (productId: string, delta: number) => void;
  onToggleFlashSale: (
    productId: string, 
    discountPercent?: number, 
    isFlashSale?: boolean,
    flashSaleData?: Partial<Product>
  ) => void;
  onBulkAddStock: (productId: string, rawKeys: string[]) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  currency,
  onAddNewProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onAdjustProductStock,
  onToggleFlashSale,
  onBulkAddStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProductForBulk, setSelectedProductForBulk] = useState<string | null>(null);
  const [bulkKeyInput, setBulkKeyInput] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productEditForm, setProductEditForm] = useState<Partial<Product>>({});

  const [newProdForm, setNewProdForm] = useState({
    title: '',
    category: 'ai_tools' as ProductCategory,
    groupPrice: 65000,
    retailPrice: 99000,
    ctvPrice: 55000,
    stockAvailable: 50,
    requiredGroupSlots: 5,
    bannerImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    description: '',
    isFlashSale: false,
    discountPercent: 20
  });

  // Sale & Discount % Modal Sub-state
  const [selectedProductForSale, setSelectedProductForSale] = useState<Product | null>(null);
  const [saleConfigForm, setSaleConfigForm] = useState({
    discountPercent: 20,
    isFlashSale: true,
    expiresHours: 24,
    customBadge: 'FLASH SALE',
    stockLimit: 50
  });

  const handleOpenSaleModal = (prod: Product) => {
    setSelectedProductForSale(prod);
    setSaleConfigForm({
      discountPercent: prod.discountPercent && prod.discountPercent > 0 ? prod.discountPercent : 20,
      isFlashSale: prod.isFlashSale ?? true,
      expiresHours: 24,
      customBadge: 'FLASH SALE',
      stockLimit: prod.flashSaleTotalStock || prod.stockAvailable || 50
    });
  };

  const handleApplySaleModal = () => {
    if (!selectedProductForSale) return;
    onToggleFlashSale(
      selectedProductForSale.id,
      saleConfigForm.discountPercent,
      saleConfigForm.isFlashSale,
      {
        flashSaleTotalStock: saleConfigForm.stockLimit,
        flashSaleStockClaimed: 80
      }
    );
    setSelectedProductForSale(null);
  };

  const handleConfirmBulkStock = () => {
    if (!selectedProductForBulk || !bulkKeyInput.trim()) return;
    const lines = bulkKeyInput
      .split('\n')
      .map(k => k.trim())
      .filter(Boolean);
    
    if (lines.length > 0) {
      onBulkAddStock(selectedProductForBulk, lines);
    }
    setSelectedProductForBulk(null);
    setBulkKeyInput('');
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdForm.title.trim()) return;

    onAddNewProduct({
      title: newProdForm.title,
      category: newProdForm.category,
      groupPrice: newProdForm.groupPrice,
      retailPrice: newProdForm.retailPrice,
      stockAvailable: newProdForm.stockAvailable,
      bannerImg: newProdForm.bannerImg,
      description: newProdForm.description,
      isFlashSale: newProdForm.isFlashSale,
      discountPercent: newProdForm.discountPercent,
      platform: 'OpenAI',
      rating: 5.0,
      reviewCount: 1,
      minSlots: newProdForm.requiredGroupSlots || 5,
      deliveryType: 'instant_key',
      deliveryEstimate: 'Giao ngay lập tức (Auto Key Vault)',
      seller: {
        id: 'seller_cyber_main',
        name: 'CyberPool Official',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        badge: 'Cyber Escrow',
        rating: 5.0,
        totalDeals: 1200,
        completedPools: 450,
        responseTime: '< 1 phút'
      },
      features: ['Bản quyền chính hãng 100%', 'Bảo hành full thời hạn'],
      instructions: ['Nhận key tự động trong Kho Key Cá Nhân sau khi hoàn tất'],
      activePools: [],
      tags: ['Hot Deal', 'Chính Hãng']
    });

    setIsAddingProduct(false);
    setNewProdForm({
      title: '',
      category: 'ai_tools',
      groupPrice: 65000,
      retailPrice: 99000,
      ctvPrice: 55000,
      stockAvailable: 50,
      requiredGroupSlots: 5,
      bannerImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      description: '',
      isFlashSale: false,
      discountPercent: 20
    });
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase">
            QUẢN LÝ SẢN PHẨM & NHẬP KHO BULK ({products.length} MẶT HÀNG)
          </h3>
          <p className="text-[11px] text-slate-400">
            Thêm sản phẩm mới, nạp danh sách key `user|pass` hàng loạt và quản lý giá sỉ CTV
          </p>
        </div>

        <button
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center gap-1.5 self-start cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isAddingProduct ? 'Đóng Form' : '+ Thêm Sản Phẩm Mới'}</span>
        </button>
      </div>

      {/* Form Thêm Sản Phẩm Mới */}
      {isAddingProduct && (
        <form onSubmit={handleCreateProductSubmit} className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-[#0d1424] to-slate-950 border-2 border-cyan-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                KHỞI TẠO SẢN PHẨM / GÓI MUA CHUNG MỚI
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              AUTO ESCROW SYNC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Tên Sản Phẩm:</label>
              <input
                type="text"
                required
                value={newProdForm.title}
                onChange={(e) => setNewProdForm({ ...newProdForm, title: e.target.value })}
                placeholder="VD: ChatGPT Plus 1 Tháng..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Chuyên Mục Sản Phẩm:</label>
              <select
                value={newProdForm.category}
                onChange={(e) => setNewProdForm({ ...newProdForm, category: e.target.value as ProductCategory })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="ai_tools">Phần Mềm Trí Tuệ Nhân Tạo (AI Tools)</option>
                <option value="gaming">Game Steam / AAA Digital Keys</option>
                <option value="streaming">Giải Trí (Netflix / Spotify / Youtube)</option>
                <option value="vpn">VPN / Proxy / Cloud Server</option>
                <option value="software">Bản Quyền Windows / Office / Adobe</option>
                <option value="giftup_cards">Thẻ Quà Tặng / GiftUp Exchange</option>
              </select>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Giá Gom Đơn Sỉ (VNĐ):</label>
              <input
                type="number"
                value={newProdForm.groupPrice}
                onChange={(e) => setNewProdForm({ ...newProdForm, groupPrice: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-bold font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Giá Bán Lẻ Ngay (VNĐ):</label>
              <input
                type="number"
                value={newProdForm.retailPrice}
                onChange={(e) => setNewProdForm({ ...newProdForm, retailPrice: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Giá Đại Lý CTV (VNĐ):</label>
              <input
                type="number"
                value={newProdForm.ctvPrice}
                onChange={(e) => setNewProdForm({ ...newProdForm, ctvPrice: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Số Lượng Kho Khởi Tạo:</label>
              <input
                type="number"
                value={newProdForm.stockAvailable}
                onChange={(e) => setNewProdForm({ ...newProdForm, stockAvailable: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 block mb-1">URL Ảnh Banner Sản Phẩm:</label>
            <input
              type="text"
              value={newProdForm.bannerImg}
              onChange={(e) => setNewProdForm({ ...newProdForm, bannerImg: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddingProduct(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Xác Nhận Đăng Sản Phẩm</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm sản phẩm theo tên, danh mục, tag..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map(prod => {
          const isEditing = editingProductId === prod.id;

          return (
            <div
              key={prod.id}
              className="p-4 sm:p-4.5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700/80 transition-all space-y-3.5 shadow-md"
            >
              {/* Top Row: Info & Main Action Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.bannerImg}
                    alt={prod.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 shadow-sm"
                  />
                  
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        value={productEditForm.title ?? prod.title}
                        onChange={(e) => setProductEditForm({ ...productEditForm, title: e.target.value })}
                        className="bg-slate-950 border border-cyan-500 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                        placeholder="Tên sản phẩm"
                      />
                      <input
                        type="number"
                        value={productEditForm.groupPrice ?? prod.groupPrice}
                        onChange={(e) => setProductEditForm({ ...productEditForm, groupPrice: parseInt(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-cyan-300 font-mono"
                        placeholder="Giá sỉ"
                      />
                      <input
                        type="number"
                        value={productEditForm.retailPrice ?? prod.retailPrice}
                        onChange={(e) => setProductEditForm({ ...productEditForm, retailPrice: parseInt(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                        placeholder="Giá lẻ"
                      />
                      <input
                        type="number"
                        value={productEditForm.ctvPrice ?? prod.tierPrices?.ctv1 ?? Math.round(prod.groupPrice * 0.9)}
                        onChange={(e) => setProductEditForm({ ...productEditForm, ctvPrice: parseInt(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-300 font-mono"
                        placeholder="Giá CTV"
                      />
                    </div>
                  ) : (
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white break-words">
                          {prod.title}
                        </span>
                        {prod.isFlashSale && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-600/90 text-white font-extrabold flex items-center gap-1 animate-pulse shadow-sm">
                            <Flame className="w-3 h-3 text-amber-200" />
                            FLASH SALE -{prod.discountPercent || 20}%
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono border border-slate-700">
                          {prod.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        ID: <span className="text-slate-300">{prod.id}</span> • Nền tảng: <span className="text-cyan-300">{prod.platform || 'Digital'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          if (onUpdateProduct) {
                            onUpdateProduct(prod.id, productEditForm);
                          }
                          setEditingProductId(null);
                          setProductEditForm({});
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingProductId(null);
                          setProductEditForm({});
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingProductId(prod.id);
                          setProductEditForm({
                            title: prod.title,
                            groupPrice: prod.groupPrice,
                            retailPrice: prod.retailPrice,
                            ctvPrice: prod.tierPrices?.ctv1 || Math.round(prod.groupPrice * 0.9)
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                        title="Sửa trực tiếp thông tin sản phẩm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => {
                          onAddNewProduct({
                            ...prod,
                            title: `${prod.title} (Bản sao)`,
                            id: undefined
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                        title="Nhân bản sản phẩm này"
                      >
                        <Copy className="w-3.5 h-3.5 text-purple-400" />
                        <span>Nhân Bản</span>
                      </button>

                      <button
                        onClick={() => setSelectedProductForBulk(prod.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>+ Nạp Kho Key</span>
                      </button>

                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/60 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Row: Price Matrix, Stock Counter & Flash Sale Modifier */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                {/* Price breakdown pill */}
                <div className="flex items-center gap-2.5 flex-wrap bg-black/40 px-3 py-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-slate-400 text-[11px]">Giá sỉ gom:</span>
                    <strong className="text-cyan-400 font-mono text-xs">{formatCurrency(prod.groupPrice, currency)}</strong>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-slate-400 text-[11px]">Giá lẻ:</span>
                    <span className="font-mono text-slate-300 text-xs">{formatCurrency(prod.retailPrice, currency)}</span>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-slate-400 text-[11px]">Đại lý CTV:</span>
                    <span className="text-emerald-400 font-mono text-xs font-bold">{formatCurrency(prod.tierPrices?.ctv1 || prod.groupPrice * 0.9, currency)}</span>
                  </div>
                </div>

                {/* Right Controls: Stock Adjuster & Flash Sale */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Interactive Flash Sale Controls */}
                  {prod.isFlashSale ? (
                    <div className="flex items-center gap-1.5 bg-red-950/70 border border-red-500/50 rounded-xl p-1 px-1.5">
                      <button
                        onClick={() => handleOpenSaleModal(prod)}
                        className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                        title="Cài đặt Flash Sale"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-200" />
                        <span>Sale -{prod.discountPercent || 20}%</span>
                      </button>

                      <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-red-500/40">
                        <span className="text-[10px] text-red-300 font-bold">%:</span>
                        <input
                          type="number"
                          min={1}
                          max={95}
                          value={prod.discountPercent || 20}
                          onChange={(e) => onToggleFlashSale(prod.id, Math.max(1, Math.min(95, parseInt(e.target.value) || 20)), true)}
                          className="w-10 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-xs text-red-300 font-bold text-center font-mono focus:border-red-400 focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => onToggleFlashSale(prod.id, 0, false)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold cursor-pointer"
                      >
                        Tắt
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenSaleModal(prod)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-md transition-all hover:scale-102"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-200" />
                      <span>Bật Sale & Set %</span>
                    </button>
                  )}

                  {/* Stock Box with quick +/- buttons */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 pl-1 font-bold">Kho:</span>
                    <input
                      type="number"
                      value={prod.stockAvailable}
                      onChange={(e) => onUpdateProductStock(prod.id, parseInt(e.target.value) || 0)}
                      className="w-12 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-xs text-white text-center font-mono font-bold"
                    />
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => {
                          if (onAdjustProductStock) {
                            onAdjustProductStock(prod.id, -1);
                          } else {
                            onUpdateProductStock(prod.id, Math.max(0, prod.stockAvailable - 1));
                          }
                        }}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center cursor-pointer"
                        title="Giảm 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => {
                          if (onAdjustProductStock) {
                            onAdjustProductStock(prod.id, 1);
                          } else {
                            onUpdateProductStock(prod.id, prod.stockAvailable + 1);
                          }
                        }}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold flex items-center justify-center cursor-pointer"
                        title="Tăng 1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => {
                          if (onAdjustProductStock) {
                            onAdjustProductStock(prod.id, 10);
                          } else {
                            onUpdateProductStock(prod.id, prod.stockAvailable + 10);
                          }
                        }}
                        className="px-1.5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold flex items-center justify-center cursor-pointer font-mono"
                        title="Tăng 10"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Key Import Modal */}
      {selectedProductForBulk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase">
                  NẠP DANH SÁCH KEY / TÀI KHOẢN HÀNG LOẠT
                </h4>
              </div>
              <button
                onClick={() => setSelectedProductForBulk(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Nhập danh sách mã key hoặc tài khoản theo định dạng <code>1 dòng = 1 key/tài khoản</code>. Hệ thống sẽ tự động cập nhật số lượng tồn kho.
            </p>

            <textarea
              rows={6}
              value={bulkKeyInput}
              onChange={(e) => setBulkKeyInput(e.target.value)}
              placeholder="VD:&#10;user1@mail.com|pass123&#10;user2@mail.com|pass456&#10;STEAM-XXXX-YYYY-ZZZZ"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-emerald-300 font-mono focus:border-cyan-400 focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedProductForBulk(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmBulkStock}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
              >
                Xác Nhận Nạp Vào Kho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flash Sale Discount Modal */}
      {selectedProductForSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b0f19] border border-red-500/50 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-400" />
                <h4 className="text-sm font-bold text-white uppercase">
                  CÀI ĐẶT FLASH SALE & GIẢM GIÁ %
                </h4>
              </div>
              <button
                onClick={() => setSelectedProductForSale(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              Sản phẩm: <span className="text-cyan-300 font-bold">{selectedProductForSale.title}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Mức Giảm Giá (%):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={90}
                    step={5}
                    value={saleConfigForm.discountPercent}
                    onChange={(e) => setSaleConfigForm({ ...saleConfigForm, discountPercent: parseInt(e.target.value) || 20 })}
                    className="flex-1 accent-red-500"
                  />
                  <span className="font-mono font-bold text-red-400 text-sm w-12 text-right">
                    -{saleConfigForm.discountPercent}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Số lượng suất Flash Sale:</label>
                <input
                  type="number"
                  value={saleConfigForm.stockLimit}
                  onChange={(e) => setSaleConfigForm({ ...saleConfigForm, stockLimit: parseInt(e.target.value) || 50 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedProductForSale(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleApplySaleModal}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-500/30"
              >
                Áp Dụng Flash Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
