import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Wallet, 
  CreditCard, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Lock, 
  Layers, 
  Tag, 
  ExternalLink,
  Gift,
  KeyRound,
  Download,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { Product, UserProfile, UserOrder } from '../types';
import { formatCurrency, generateTxHash, generateRandomKey } from '../utils/formatters';

interface InstantBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  user: UserProfile;
  onSuccessOrder: (order: UserOrder, paymentAmount: number, paymentMethod: string) => void;
  onOpenWallet: () => void;
  onOpenVault: () => void;
}

export const InstantBuyModal: React.FC<InstantBuyModalProps> = ({
  isOpen,
  onClose,
  product,
  user,
  onSuccessOrder,
  onOpenWallet,
  onOpenVault
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountPercent: number } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'vietqr' | 'telco'>('wallet');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [deliveredOrder, setDeliveredOrder] = useState<UserOrder | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Telco state for direct card payment
  const [telcoType, setTelcoType] = useState<string>('VIETTEL');
  const [cardPin, setCardPin] = useState<string>('');
  const [cardSerial, setCardSerial] = useState<string>('');

  if (!isOpen || !product) return null;

  // Pricing calculations
  const unitPrice = product.retailPrice;
  const rawTotal = unitPrice * quantity;
  
  // Bulk discount: 2-4 items -> 3% off, >= 5 items -> 7% off
  const bulkDiscountPercent = quantity >= 5 ? 7 : quantity >= 2 ? 3 : 0;
  const bulkDiscountAmount = Math.round(rawTotal * (bulkDiscountPercent / 100));

  // Voucher discount
  const voucherDiscountPercent = appliedVoucher ? appliedVoucher.discountPercent : 0;
  const voucherDiscountAmount = Math.round(rawTotal * (voucherDiscountPercent / 100));

  const totalDiscount = bulkDiscountAmount + voucherDiscountAmount;
  const finalTotal = Math.max(1000, rawTotal - totalDiscount);

  const hasEnoughBalance = user.walletBalance >= finalTotal;
  const balanceDifference = finalTotal - user.walletBalance;

  const handleApplyVoucher = () => {
    setVoucherError(null);
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'CYBER2026' || code === 'VIP10') {
      setAppliedVoucher({ code, discountPercent: 10 });
    } else if (code === 'ESCROW50' || code === 'SUPER5') {
      setAppliedVoucher({ code, discountPercent: 5 });
    } else {
      setVoucherError('Mã ưu đãi không hợp lệ hoặc đã hết lượt áp dụng.');
    }
  };

  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadLicenseTxt = (order: UserOrder) => {
    const content = `=====================================================
CYBERPOOL TESLA ESCROW V4.2 - BIÊN LAI GIAO KEY BẢN QUYỀN
=====================================================
Mã Đơn Hàng: ${order.id}
Sản Phẩm: ${order.productTitle}
Nền Tảng: ${order.platform}
Thời Gian Giao: ${order.createdAt}
Mã Giao Dịch Escrow: ${order.txId}
Tổng Tiền Đã Thanh Toán: ${formatCurrency(order.pricePaid, user.currency)}

-----------------------------------------------------
THÔNG TIN BẢN QUYỀN / KEY ĐÃ KÍCH HOẠT:
Mã Key / License: ${order.deliveredKey || 'N/A'}
Mã PIN Bảo Vệ: ${order.pinCode || '8821'}
${order.giftUpCard ? `Số Thẻ GiftUp: ${order.giftUpCard.cardNumber}\nPIN: ${order.giftUpCard.pinCode}\nBarcode: ${order.giftUpCard.barcode}\nLink Redeem: ${order.giftUpCard.redeemUrl}` : ''}
-----------------------------------------------------

HƯỚNG DẪN KÍCH HOẠT:
1. Đăng nhập vào ứng dụng / nền tảng chính thức (${order.platform}).
2. Nhập mã bản quyền hoặc Redeem mã thẻ quà tặng.
3. Liên hệ CSKH 24/7 hoặc mở Ticket nếu cần bảo hành đổi 1:1.

Cảm ơn bạn đã giao dịch tại CyberPool Escrow Network!
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberPool_${order.id}_License.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExecutePurchase = (method: 'wallet' | 'vietqr' | 'telco') => {
    if (method === 'wallet' && !hasEnoughBalance) {
      onOpenWallet();
      return;
    }

    if (method === 'telco' && (!cardPin.trim() || !cardSerial.trim())) {
      alert('Vui lòng nhập đầy đủ mã thẻ và số serial thẻ cào!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const randomKey = generateRandomKey(product.platform);
      const newOrder: UserOrder = {
        id: `ord-retail-${Date.now()}`,
        productId: product.id,
        productTitle: `${product.title} (x${quantity})`,
        platform: product.platform,
        type: 'instant_single',
        pricePaid: finalTotal,
        status: 'fulfilled',
        createdAt: new Date().toLocaleString('vi-VN'),
        deliveredKey: randomKey,
        pinCode: '8821',
        giftUpCard: product.deliveryType === 'giftup_card' ? {
          cardNumber: `4928 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
          pinCode: '8821',
          barcode: `GU-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          balance: 50,
          currency: 'USD',
          expiryDate: '12/2028',
          redeemUrl: 'https://giftup.app/redeem/cyberpool'
        } : undefined,
        txId: `TX-RETAIL-${Date.now().toString().slice(-6)}`
      };

      setIsProcessing(false);
      setDeliveredOrder(newOrder);
      onSuccessOrder(newOrder, finalTotal, method);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Glowing Header Bar */}
        <div className="relative p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#0d1424] via-[#101c33] to-[#0d1424] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500 text-black uppercase tracking-wider">
                  MUA LẺ TỨC THÌ
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Sẵn Kho Giao Trong 3 Giây
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
                {deliveredOrder ? 'GIAO KEY BẢN QUYỀN THÀNH CÔNG' : 'XÁC NHẬN ĐẶT MUA LẺ TRỰC TIẾP'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* ================= VIEW 1: SUCCESSFUL DELIVERY SCREEN ================= */}
          {deliveredOrder ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Success Badge */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    GIAO DỊCH HOÀN TẤT // KEY ĐÃ SẴN SÀNG
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Đã thanh toán thành công {formatCurrency(deliveredOrder.pricePaid, user.currency)} cho đơn hàng lẻ!
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Mã đơn: <span className="text-cyan-400 font-bold">{deliveredOrder.id}</span> • TxID: <span className="text-slate-300">{deliveredOrder.txId}</span>
                  </div>
                </div>
              </div>

              {/* Delivered Key Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold uppercase text-slate-200">
                      Mã Key Bản Quyền / Thông Tin Kích Hoạt
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Bảo hành 1:1 Trọn Đời
                  </span>
                </div>

                {/* Big Key Display */}
                <div className="p-3.5 rounded-lg bg-black/90 border border-cyan-500/60 flex items-center justify-between gap-3 shadow-inner">
                  <div className="font-mono font-black text-cyan-300 text-sm sm:text-base tracking-wider break-all select-all">
                    {deliveredOrder.deliveredKey}
                  </div>
                  <button
                    onClick={() => handleCopyText(deliveredOrder.deliveredKey || '', 'delivered_key')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shrink-0 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  >
                    {copiedField === 'delivered_key' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã Chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao Chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Additional PIN or GiftUp Info */}
                {deliveredOrder.pinCode && (
                  <div className="flex items-center justify-between text-xs font-mono p-2.5 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">Mã PIN bảo mật:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{deliveredOrder.pinCode}</span>
                      <button
                        onClick={() => handleCopyText(deliveredOrder.pinCode || '', 'pin')}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] underline cursor-pointer"
                      >
                        {copiedField === 'pin' ? 'Đã chép' : 'Chép PIN'}
                      </button>
                    </div>
                  </div>
                )}

                {deliveredOrder.giftUpCard && (
                  <div className="p-3 rounded-lg bg-pink-950/30 border border-pink-500/40 text-xs font-mono space-y-1.5">
                    <div className="text-pink-400 font-bold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" /> Thẻ Quà Tặng GiftUp Card
                    </div>
                    <div className="text-slate-300 flex justify-between">
                      <span>Số thẻ: <strong>{deliveredOrder.giftUpCard.cardNumber}</strong></span>
                      <span>Mệnh giá: <strong>${deliveredOrder.giftUpCard.balance} USD</strong></span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Redeem tại: <a href={deliveredOrder.giftUpCard.redeemUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{deliveredOrder.giftUpCard.redeemUrl}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Step by Step Activation Guide */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5 text-xs">
                <div className="font-mono font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Hướng Dẫn Sử Dụng & Kích Hoạt Nhanh</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li>Truy cập trang web hoặc ứng dụng chính thức của <strong className="text-white">{product.platform}</strong>.</li>
                  <li>Đăng nhập tài khoản của bạn, vào mục Redeem Code / Cài Đặt Bản Quyền.</li>
                  <li>Dán mã bản quyền ở trên vào và bấm Xác nhận để nhận toàn bộ tính năng.</li>
                  <li>Key này đã được lưu tự động và an toàn trong <strong className="text-cyan-300">Kho Key (Vault)</strong> của bạn.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleDownloadLicenseTxt(deliveredOrder)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Tải File Bản Quyền (.TXT)</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenVault();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Mở Kho Key Lưu Trữ (Vault)</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: PRODUCT CHECKOUT FORM ================= */
            <>
              {/* Product Presentation Card */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={product.bannerImg}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-24 h-24 rounded-lg object-cover border border-slate-700 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-cyan-500/30">
                      {product.platform}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5">
                      ★ {product.rating || 5.0} ({product.reviewCount || 36} đánh giá)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Escrow Bảo Lãnh
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-mono text-white leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {product.description || product.subtitle}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-1">
                    <span>Nhà cung cấp: <strong className="text-white">{product.seller.name}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-400">Kho sẵn: {product.stockAvailable || 15} key</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector & Bulk Discount Pod */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Quantity Controls */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Số Lượng Cần Mua:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-base flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 h-9 rounded-lg bg-slate-900 border border-slate-700 text-center font-mono font-bold text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-base flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    * Mua từ 2 key giảm 3%, mua từ 5 key giảm 7% tự động.
                  </div>
                </div>

                {/* Discount Code Input */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                    <span>Mã Giảm Giá / Voucher:</span>
                    <span className="text-[10px] text-cyan-400 font-normal">CYBER2026 / VIP10</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã code..."
                      className="flex-1 h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="h-9 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase cursor-pointer"
                    >
                      Áp Dụng
                    </button>
                  </div>
                  {appliedVoucher && (
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã giảm -{appliedVoucher.discountPercent}% cho mã [{appliedVoucher.code}]
                    </div>
                  )}
                  {voucherError && (
                    <div className="text-[10px] font-mono text-rose-400">
                      {voucherError}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown Matrix */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Giá bán lẻ niêm yết:</span>
                  <span>{formatCurrency(unitPrice, user.currency)} / key</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Số lượng:</span>
                  <span>x {quantity}</span>
                </div>
                {bulkDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Chiết khấu số lượng ({bulkDiscountPercent}%):</span>
                    <span>-{formatCurrency(bulkDiscountAmount, user.currency)}</span>
                  </div>
                )}
                {voucherDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Mã giảm giá ({appliedVoucher?.code} -{voucherDiscountPercent}%):</span>
                    <span>-{formatCurrency(voucherDiscountAmount, user.currency)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Tổng Tiền Cần Thanh Toán:</span>
                  <span className="text-xl font-black text-cyan-400">
                    {formatCurrency(finalTotal, user.currency)}
                  </span>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>Chọn Phương Thức Thanh Toán:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Method 1: Wallet Balance */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Wallet className="w-4 h-4 text-cyan-400" />
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        Nhanh Nhất
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono">Ví CyberPool</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      Số dư: <strong className={hasEnoughBalance ? 'text-emerald-400' : 'text-rose-400'}>{formatCurrency(user.walletBalance, user.currency)}</strong>
                    </div>
                  </button>

                  {/* Method 2: VietQR Direct QR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'vietqr'
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Tự Động 3s
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono">VietQR Trực Tiếp</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      Quét mã ngân hàng
                    </div>
                  </button>

                  {/* Method 3: Telco Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('telco')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'telco'
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Thẻ Cào
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono">Đổi Thẻ Cào</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      Viettel, Vina, Mobi
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Details Panel based on Selection */}
              {paymentMethod === 'vietqr' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">Mã Chuyển Khoản VietQR Đơn Lẻ:</span>
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Tự động khớp lệnh 24/7
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/95 text-black">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=CYBERPOOL_BUY_${product.id}_${finalTotal}_${encodeURIComponent(user.id)}`}
                        alt="VietQR"
                        className="w-32 h-32 object-contain"
                      />
                      <span className="text-[10px] font-mono font-bold mt-1 text-slate-700">
                        Quét Bằng Mọi App Ngân Hàng
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">Ngân hàng:</span>
                        <strong className="text-white">MB Bank (Quân Đội)</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">Số tài khoản:</span>
                        <strong className="text-cyan-400 font-bold">888899990001</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">Chủ tài khoản:</span>
                        <strong className="text-white">CYBERPOOL ESCROW CO</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">Số tiền:</span>
                        <strong className="text-emerald-400 font-bold">{formatCurrency(finalTotal, user.currency)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'telco' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
                  <div className="text-slate-300 font-bold">Nhập Thông Tin Thẻ Cào Thanh Toán Lẻ:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['VIETTEL', 'VINAPHONE', 'MOBIFONE', 'ZING'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTelcoType(t)}
                        className={`py-2 px-3 rounded-lg border text-center font-bold cursor-pointer ${
                          telcoType === t
                            ? 'bg-cyan-500 text-black border-cyan-400'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={cardPin}
                      onChange={e => setCardPin(e.target.value)}
                      placeholder="Mã PIN thẻ cào (12-16 số)..."
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      value={cardSerial}
                      onChange={e => setCardSerial(e.target.value)}
                      placeholder="Số Serial in trên thẻ..."
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* Insufficient Balance Notice if wallet selected */}
              {paymentMethod === 'wallet' && !hasEnoughBalance && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Số dư ví hiện tại còn thiếu <strong>{formatCurrency(balanceDifference, user.currency)}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenWallet}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    + Nạp Ví Ngay
                  </button>
                </div>
              )}

              {/* EXECUTE CHECKOUT BUTTON */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleExecutePurchase(paymentMethod)}
                  disabled={isProcessing || (paymentMethod === 'wallet' && !hasEnoughBalance)}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-mono font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(6,182,212,0.45)] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>ĐANG XÁC THỰC & BUNG KEY TỰ ĐỘNG...</span>
                    </>
                  ) : paymentMethod === 'wallet' && !hasEnoughBalance ? (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>SỐ DƯ VÍ KHÔNG ĐỦ // BẤM ĐỂ NẠP THÊM</span>
                    </>
                  ) : paymentMethod === 'vietqr' ? (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>TÔI ĐÃ QUÉT QR // BUNG KEY NGAY ({formatCurrency(finalTotal, user.currency)})</span>
                    </>
                  ) : paymentMethod === 'telco' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>GẠCH THẺ CÀO & MUA LẺ NGAY</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>XÁC NHẬN MUA LẺ NGAY ({formatCurrency(finalTotal, user.currency)})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
