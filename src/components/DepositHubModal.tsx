import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  ArrowRight,
  Wallet,
  Coins,
  Smartphone,
  ExternalLink,
  Zap,
  Info,
  Sparkles
} from 'lucide-react';
import { UserProfile, TransactionRecord, TelcoCardSubmission, SystemConfig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DepositHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onDepositSuccess: (amount: number, method: string, txCode: string) => void;
  onOpenCardModal?: () => void;
  transactions?: TransactionRecord[];
  systemConfig?: SystemConfig;
}

const DEPOSIT_PRESETS = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];

export const DepositHubModal: React.FC<DepositHubModalProps> = ({
  isOpen,
  onClose,
  user,
  onDepositSuccess,
  onOpenCardModal,
  transactions = [],
  systemConfig
}) => {
  if (!isOpen) return null;

  const [activeChannel, setActiveChannel] = useState<'vietqr' | 'momo' | 'crypto' | 'ltc' | 'binance' | 'card' | 'history'>('vietqr');
  const [depositAmount, setDepositAmount] = useState<number>(200000);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(900); // 15 mins
  const [binanceTxInput, setBinanceTxInput] = useState('');
  const [ltcCustomInput, setLtcCustomInput] = useState<string>('');

  const transferCode = `CYBER ${user.id.replace('user-', '').toUpperCase()}`;
  const bankAccount = {
    bankName: systemConfig?.bankName || 'MB BANK (Quân Đội)',
    bankCode: 'MB',
    accountNumber: systemConfig?.bankAccountNo || '0988889999',
    accountHolder: systemConfig?.bankAccountName || 'CYBERPOOL ESCROW GATEWAY'
  };

  const momoAccount = {
    phone: systemConfig?.momoPhone || '0988889999',
    holder: systemConfig?.momoName || 'NGUYEN HOANG LONG (CYBERPOOL)'
  };

  const usdtAccount = {
    network: 'TRC20 & BEP20',
    address: systemConfig?.cryptoUsdtAddress || 'TWYvQ5X4h3uC48K8kS1mN7kY6Q3kH2g9aB',
    rate: systemConfig?.usdToVndRate || 25400
  };

  const ltcAccount = {
    network: 'Litecoin Core (LTC Mainnet)',
    address: systemConfig?.cryptoLtcAddress || 'LZeE2hL9qHSmV7gJ2wH7QG9Z2C81uYyX3w',
    rate: systemConfig?.cryptoLtcRate || 2150000,
    confirmations: 2
  };

  const binanceAccount = {
    payId: systemConfig?.binancePayId || '582910384',
    uid: systemConfig?.binanceUid || '293847291',
    nickname: systemConfig?.binanceNickname || 'CYBERPOOL_PAY',
    rate: systemConfig?.usdToVndRate || 25400
  };

  // Calculated LTC amount
  const calculatedLtcAmount = (depositAmount / ltcAccount.rate).toFixed(6);

  // VietQR Dynamic URL (QuickLink compatible)
  const vietQrUrl = `https://api.vietqr.io/image/970422-${bankAccount.accountNumber}-compact2.jpg?amount=${depositAmount}&addInfo=${encodeURIComponent(transferCode)}&accountName=${encodeURIComponent(bankAccount.accountHolder)}`;

  // LTC QR Code URL
  const ltcQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `litecoin:${ltcAccount.address}?amount=${calculatedLtcAmount}&label=CyberPool_${user.id}&message=${transferCode}`
  )}`;

  // Binance Pay QR Code URL
  const binanceQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `https://app.binance.com/qr/dop${binanceAccount.payId}?memo=${transferCode}&amount=${(depositAmount / binanceAccount.rate).toFixed(2)}`
  )}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulate Instant Auto Banking Check
  const handleVerifyBanking = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const fakeTx = `TX-QR-${Math.floor(100000 + Math.random() * 900000)}`;
      onDepositSuccess(depositAmount, 'VietQR Tự Động', fakeTx);
      onClose();
    }, 1800);
  };

  // Simulate Instant LTC Blockchain Check
  const handleVerifyLTC = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const fakeTx = `LTC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      onDepositSuccess(depositAmount, 'Litecoin (LTC Mainnet)', fakeTx);
      onClose();
    }, 2000);
  };

  // Simulate Instant Binance Pay Webhook Check
  const handleVerifyBinancePay = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const fakeTx = binanceTxInput.trim() ? `BPAY-${binanceTxInput.trim()}` : `BPAY-${Math.floor(100000000 + Math.random() * 900000000)}`;
      onDepositSuccess(depositAmount, 'Binance Pay / UID', fakeTx);
      onClose();
    }, 1800);
  };

  const depositTransactions = transactions.filter(t => t.type.startsWith('deposit'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#090c15] border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-[#0d1424] to-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono font-bold flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono text-white tracking-wide">
                  CỔNG NẠP TIỀN ĐA KÊNH TỰ ĐỘNG 24/7 (SHOPCLONE7 GATEWAY)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  AUTO DUYỆT 3-30S
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Nạp VietQR ngân hàng, Thẻ cào viễn thông, Ví điện tử & Tiền số Crypto không chiết khấu ẩn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 pt-2 gap-2 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveChannel('vietqr')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeChannel === 'vietqr'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Ngân Hàng VietQR Pro</span>
          </button>

          <button
            onClick={() => setActiveChannel('momo')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeChannel === 'momo'
                ? 'border-pink-400 text-pink-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-pink-400" />
            <span>Ví MoMo / ZaloPay</span>
          </button>

          <button
            onClick={() => setActiveChannel('crypto')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeChannel === 'crypto'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Crypto USDT</span>
          </button>

          <button
            onClick={() => setActiveChannel('ltc')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeChannel === 'ltc'
                ? 'border-blue-400 text-blue-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="font-bold">Litecoin (LTC)</span>
            <span className="px-1 py-0.2 rounded text-[9px] bg-blue-950 text-blue-300 border border-blue-500/30">Mới</span>
          </button>

          <button
            onClick={() => setActiveChannel('binance')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeChannel === 'binance'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center">B</div>
            <span className="font-bold">ID Binance / Pay</span>
            <span className="px-1 py-0.2 rounded text-[9px] bg-amber-950 text-amber-300 border border-amber-500/30">0% Phí</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenCardModal();
            }}
            className="pb-2.5 px-3 border-b-2 border-transparent text-purple-400 hover:text-purple-300 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <CreditCard className="w-4 h-4" />
            <span>Nạp Thẻ Cào (Card API) ↗</span>
          </button>

          <button
            onClick={() => setActiveChannel('history')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ml-auto ${
              activeChannel === 'history'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Lịch Sử Nạp</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">
              {depositTransactions.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeChannel === 'vietqr' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: QR Code Visual */}
              <div className="lg:col-span-5 flex flex-col items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3 text-center">
                <div className="p-2.5 rounded-xl bg-white shadow-xl relative group">
                  <img
                    src={vietQrUrl}
                    alt="VietQR MBBank"
                    className="w-56 h-56 object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback QR visual
                      e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        `STK:${bankAccount.accountNumber}|NH:${bankAccount.bankCode}|TIEN:${depositAmount}|ND:${transferCode}`
                      )}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg text-white font-bold text-xs">
                    Quét trên app Ngân Hàng
                  </div>
                </div>

                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Mã QR hiệu lực: {formatCountdown(countdownSeconds)}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mở ứng dụng Mobile Banking của bất kỳ ngân hàng nào (MB, VCB, Tech, BIDV...) và quét mã QR trên để nạp tiền tự động 100%.
                </p>
              </div>

              {/* Right Column: Amount Selection & Bank Details */}
              <div className="lg:col-span-7 space-y-4">
                {/* Presets Amount Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200">1. CHỌN SỐ TIỀN CẦN NẠP VÀO VÍ:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {DEPOSIT_PRESETS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          depositAmount === amt
                            ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {formatCurrency(amt, user.currency)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transfer Info Details Box */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-white border-b border-slate-800 pb-2">
                    2. THÔNG TIN CHUYỂN KHOẢN CHÍNH XÁC:
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-black/40">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="text-white font-bold">{bankAccount.bankName}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-black/40">
                    <span className="text-slate-400">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-300 font-bold text-sm tracking-wider">{bankAccount.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(bankAccount.accountNumber, 'stk')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        {copiedField === 'stk' ? '✓ Đã chép' : 'Chép'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-black/40">
                    <span className="text-slate-400">Chủ tài khoản:</span>
                    <span className="text-white font-bold">{bankAccount.accountHolder}</span>
                  </div>

                  {/* Crucial Transfer Code Note */}
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-red-300 uppercase font-bold">Nội Dung Chuyển Khoản (Bắt Buộc):</div>
                      <div className="text-base text-yellow-300 font-black tracking-widest mt-0.5">{transferCode}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(transferCode, 'memo')}
                      className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'memo' ? 'Đã sao chép' : 'Sao chép mã'}</span>
                    </button>
                  </div>
                </div>

                {/* Instant Verification Trigger */}
                <button
                  type="button"
                  onClick={handleVerifyBanking}
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ĐANG QUÉT GIAO DỊCH QUA API MBBANK...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>TÔI ĐÃ CHUYỂN TIỀN // KIỂM TRA & CỘNG VÍ NGAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeChannel === 'momo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3 text-center">
                <div className="p-3 bg-pink-950/60 rounded-2xl border border-pink-500/40 text-pink-400">
                  <Smartphone className="w-12 h-12" />
                </div>
                <div className="text-sm font-bold text-white">VÍ ĐIỆN TỬ MOMO AUTO</div>
                <div className="text-xs text-slate-400">Quét mã chuyển tiền hoặc chuyển theo SĐT</div>
              </div>

              <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center p-2 rounded bg-black/40">
                  <span className="text-slate-400">Số điện thoại MoMo:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-pink-300 font-bold">{momoAccount.phone}</strong>
                    <button
                      onClick={() => handleCopy(momoAccount.phone, 'momo_phone')}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px]"
                    >
                      {copiedField === 'momo_phone' ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40">
                  <span className="text-slate-400">Tên người nhận:</span>
                  <strong className="text-white">{momoAccount.holder}</strong>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-black/40">
                  <span className="text-slate-400">Lời nhắn / Memo:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-yellow-300 font-bold">{transferCode}</strong>
                    <button
                      onClick={() => handleCopy(transferCode, 'momo_memo')}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px]"
                    >
                      {copiedField === 'momo_memo' ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyBanking}
                  disabled={isVerifying}
                  className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 mt-2"
                >
                  {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>XÁC NHẬN ĐÃ CHUYỂN QUA MOMO</span>
                </button>
              </div>
            </div>
          )}

          {activeChannel === 'crypto' && (
            <div className="space-y-4">
              {/* Crypto Sub-options / Switcher */}
              <div className="flex gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveChannel('crypto')}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 text-black font-black flex items-center justify-center gap-1.5 shadow-md text-xs"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>USDT (TRC20 / BEP20)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('ltc')}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-950 text-slate-300 hover:text-white font-bold flex items-center justify-center gap-1.5 text-xs transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Litecoin (LTC)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('binance')}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-950 text-slate-300 hover:text-white font-bold flex items-center justify-center gap-1.5 text-xs transition-colors"
                >
                  <div className="w-3 h-3 rounded-full bg-amber-400 text-black font-black text-[8px] flex items-center justify-center">B</div>
                  <span>Binance Pay / UID</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                <div>
                  <div className="font-bold">TỶ GIÁ NẠP USDT HÔM NAY:</div>
                  <div className="text-lg font-black text-white mt-0.5">1 USDT = {formatCurrency(usdtAccount.rate, user.currency)}</div>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                  TRC20 & BEP20 (TỰ ĐỘNG)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300">ĐỊA CHỈ VÍ USDT (MẠNG TRC20 - TRON):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={usdtAccount.address}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-300 font-bold text-xs"
                  />
                  <button
                    onClick={() => handleCopy(usdtAccount.address, 'usdt_addr')}
                    className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedField === 'usdt_addr' ? 'Đã chép' : 'Sao Chép'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Hệ thống tự động quét block trên TronGrid sau 1 xác nhận mạng. Tiền sẽ được quy đổi sang VNĐ và nạp thẳng vào ví CyberPool của bạn.
                </p>
              </div>
            </div>
          )}

          {/* CHANNEL: LITECOIN (LTC) */}
          {activeChannel === 'ltc' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: LTC QR Code */}
              <div className="lg:col-span-5 flex flex-col items-center bg-slate-900/60 p-4 rounded-2xl border border-blue-500/30 space-y-3 text-center">
                <div className="p-2.5 rounded-xl bg-white shadow-xl relative group">
                  <img
                    src={ltcQrUrl}
                    alt="Litecoin LTC QR Code"
                    className="w-52 h-52 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(ltcAccount.address)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-lg text-white font-bold text-xs p-2">
                    <span>Quét trên Trust Wallet / Exodus / Binance</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-500/30">
                  <Zap className="w-4 h-4" />
                  <span>Xác nhận mạng: {ltcAccount.confirmations} Blocks (~3-5 phút)</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mở ví Crypto của bạn (Trust Wallet, Binance, Coinomi, Exodus...) chuyển đúng số lượng LTC vào địa chỉ bên phải.
                </p>
              </div>

              {/* Right: LTC Details & Rate Calculator */}
              <div className="lg:col-span-7 space-y-3.5">
                {/* LTC Rate Box */}
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-300 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[11px] text-blue-300">TỶ GIÁ NẠP LITECOIN (LTC):</div>
                    <div className="text-base font-black text-white mt-0.5">
                      1 LTC = {formatCurrency(ltcAccount.rate, user.currency)} <span className="text-xs text-blue-400 font-normal">(~$84.65)</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                    LTC Core Mainnet
                  </span>
                </div>

                {/* Amount presets picker */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-200">1. CHỌN SỐ TIỀN VNĐ MUỐN NẠP:</label>
                    <span className="text-blue-400 font-bold">≈ {calculatedLtcAmount} LTC</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {DEPOSIT_PRESETS.slice(0, 4).map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`p-1.5 rounded-lg border text-center transition-all ${
                          depositAmount === amt
                            ? 'bg-blue-500 text-black font-bold border-blue-400 shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {formatCurrency(amt, user.currency)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LTC Address details box */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="text-xs font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>2. ĐỊA CHỈ VÍ LITECOIN (LTC):</span>
                    <span className="text-[10px] text-blue-400">Mạng: LTC Core</span>
                  </div>

                  <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg">
                    <input
                      type="text"
                      readOnly
                      value={ltcAccount.address}
                      className="flex-1 bg-transparent text-blue-300 font-mono font-bold text-xs outline-none"
                    />
                    <button
                      onClick={() => handleCopy(ltcAccount.address, 'ltc_addr')}
                      className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'ltc_addr' ? 'Đã chép' : 'Sao Chép'}</span>
                    </button>
                  </div>

                  {/* Memo */}
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-red-300 uppercase font-bold">Nội Dung Memo (Nếu ví hỗ trợ):</div>
                      <div className="text-xs text-yellow-300 font-black tracking-wider mt-0.5">{transferCode}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(transferCode, 'ltc_memo')}
                      className="px-2.5 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'ltc_memo' ? 'Đã sao chép' : 'Chép Memo'}</span>
                    </button>
                  </div>
                </div>

                {/* Instant Verification Trigger */}
                <button
                  type="button"
                  onClick={handleVerifyLTC}
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ĐANG QUÉT GIAO DỊCH QUA BLOCKCHAIR LTC NODE...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>TÔI ĐÃ CHUYỂN LTC // KIỂM TRA & CỘNG VÍ NGAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* CHANNEL: BINANCE PAY / ID BINANCE (UID) */}
          {activeChannel === 'binance' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Binance Pay QR */}
              <div className="lg:col-span-5 flex flex-col items-center bg-slate-900/60 p-4 rounded-2xl border border-amber-500/30 space-y-3 text-center">
                <div className="p-2.5 rounded-xl bg-white shadow-xl relative group">
                  <img
                    src={binanceQrUrl}
                    alt="Binance Pay QR Code"
                    className="w-52 h-52 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        `https://app.binance.com/qr/dop${binanceAccount.payId}`
                      )}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-lg text-white font-bold text-xs p-2">
                    <span>Mở app Binance quét mã QR Pay</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
                  <Sparkles className="w-4 h-4" />
                  <span>Miễn phí 0% Phí Chuyển • Tự Động Khớp Sau 5s</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chuyển nội bộ bằng Binance Pay ID hoặc UID từ tài khoản Binance của bạn đến tài khoản nhận sàn CyberPool.
                </p>
              </div>

              {/* Right: Binance Pay Account Details & Form */}
              <div className="lg:col-span-7 space-y-3.5">
                {/* Binance Rate & Feature Box */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[11px] text-amber-300">TỶ GIÁ BINANCE PAY (USDT / FDUSD):</div>
                    <div className="text-base font-black text-white mt-0.5">
                      1 USDT/FDUSD = {formatCurrency(binanceAccount.rate, user.currency)}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    BINANCE INTERNAL 0% FEE
                  </span>
                </div>

                {/* Binance Pay Info Box */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>THÔNG TIN NHẬN BINANCE PAY:</span>
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Verified Merchant</span>
                  </div>

                  {/* Binance Pay ID */}
                  <div className="flex items-center justify-between p-2 rounded bg-black/40">
                    <span className="text-slate-400 text-[11px]">Binance Pay ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-mono font-bold text-sm tracking-wider">{binanceAccount.payId}</span>
                      <button
                        onClick={() => handleCopy(binanceAccount.payId, 'binance_pay_id')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        {copiedField === 'binance_pay_id' ? '✓ Đã chép' : 'Chép'}
                      </button>
                    </div>
                  </div>

                  {/* Binance UID */}
                  <div className="flex items-center justify-between p-2 rounded bg-black/40">
                    <span className="text-slate-400 text-[11px]">Binance UID (User ID):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-300 font-mono font-bold text-xs tracking-wider">{binanceAccount.uid}</span>
                      <button
                        onClick={() => handleCopy(binanceAccount.uid, 'binance_uid')}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        {copiedField === 'binance_uid' ? '✓ Đã chép' : 'Chép'}
                      </button>
                    </div>
                  </div>

                  {/* Binance Nickname */}
                  <div className="flex items-center justify-between p-2 rounded bg-black/40">
                    <span className="text-slate-400 text-[11px]">Biệt danh người nhận:</span>
                    <span className="text-white font-bold">{binanceAccount.nickname}</span>
                  </div>

                  {/* Memo Transfer Code */}
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-red-300 uppercase font-bold">Nội Dung Chuyển / Note (Bắt Buộc):</div>
                      <div className="text-xs text-yellow-300 font-black tracking-wider mt-0.5">{transferCode}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(transferCode, 'binance_memo')}
                      className="px-2.5 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'binance_memo' ? 'Đã sao chép' : 'Chép Note'}</span>
                    </button>
                  </div>
                </div>

                {/* Input Binance Order ID / Tx ID */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-bold">
                    NHẬP MÃ GIAO DỊCH BINANCE PAY (ORDER ID / TX ID) ĐỂ TĂNG TỐC KHỚP LỆNH:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 293848192039 hoặc mã chuyển tiền..."
                    value={binanceTxInput}
                    onChange={(e) => setBinanceTxInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={handleVerifyBinancePay}
                  disabled={isVerifying}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ĐANG XÁC MINH VỚI BINANCE PAY MERCHANT API...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>XÁC NHẬN ĐÃ CHUYỂN QUA BINANCE PAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeChannel === 'history' && (
            <div className="space-y-3">
              {depositTransactions.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-500">
                  Chưa có lịch sử giao dịch nạp tiền nào.
                </div>
              ) : (
                depositTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white font-bold">{tx.description}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Mã: {tx.txCode} • {tx.createdAt}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-emerald-400 font-bold text-sm">+{formatCurrency(tx.amount, user.currency)}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                        Thành công
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
