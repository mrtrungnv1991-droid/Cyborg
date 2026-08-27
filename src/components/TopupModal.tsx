import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Gamepad2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Sparkles, 
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Server,
  UserCheck
} from 'lucide-react';
import { GameItem, TopupTier, TopupOrder, UserProfile } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TopupModalProps {
  game: GameItem | null;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onConfirmTopup: (order: TopupOrder, isGroupTopup: boolean) => void;
  onOpenWallet: () => void;
}

export const TopupModal: React.FC<TopupModalProps> = ({
  game,
  isOpen,
  onClose,
  user,
  onConfirmTopup,
  onOpenWallet
}) => {
  if (!isOpen || !game) return null;

  const [selectedTier, setSelectedTier] = useState<TopupTier>(game.tiers[0]);
  const [uid, setUid] = useState('');
  const [selectedServer, setSelectedServer] = useState(game.servers?.[0] || '');
  const [zoneId, setZoneId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCharacter, setVerifiedCharacter] = useState<string | null>(null);
  const [mode, setMode] = useState<'instant_direct' | 'group_topup'>('instant_direct');
  const [selectedProvider, setSelectedProvider] = useState<'Midasbuy API' | 'SmileOne Direct' | 'Garena Partner' | 'UniPin Gateway'>('Midasbuy API');
  const [isProcessing, setIsProcessing] = useState(false);

  const price = mode === 'group_topup' ? selectedTier.groupPrice : selectedTier.retailPrice;
  const isBalanceSufficient = user.walletBalance >= price;

  // Simulate UID Lookup
  const handleVerifyAccount = () => {
    if (!uid.trim()) return;
    setIsVerifying(true);
    setVerifiedCharacter(null);

    setTimeout(() => {
      setIsVerifying(false);
      const randomNick = ['CyberWhale_VN', 'ShadowBlade_88', 'LinhGaming_99', 'Elon_Gamer'][Math.floor(Math.random() * 4)];
      setVerifiedCharacter(`${randomNick} (Cấp độ 60 • Hợp lệ)`);
    }, 800);
  };

  const handleSubmit = () => {
    if (!uid.trim()) return;
    if (!isBalanceSufficient) {
      onOpenWallet();
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: TopupOrder = {
        id: `topup-${Date.now()}`,
        gameId: game.id,
        gameTitle: game.name,
        uid: uid.trim(),
        zoneId: zoneId.trim() || undefined,
        server: selectedServer || undefined,
        characterName: verifiedCharacter ? verifiedCharacter.split(' ')[0] : 'In-game Player',
        tierName: selectedTier.name,
        pricePaid: price,
        status: 'completed',
        txId: `TX-TOPUP-${Date.now().toString().slice(-6)}`,
        provider: selectedProvider,
        createdAt: new Date().toLocaleTimeString('vi-VN')
      };

      onConfirmTopup(newOrder, mode === 'group_topup');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl bg-[#0c0f17] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Banner Header */}
        <div className="relative h-32 sm:h-40 overflow-hidden bg-slate-900 border-b border-slate-800">
          <img 
            src={game.banner} 
            alt={game.name}
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-[#0c0f17]/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border border-cyan-400/50 overflow-hidden bg-slate-950 p-1 shadow-lg shrink-0">
              <img src={game.thumbnail} alt={game.name} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30 uppercase">
                  {game.publisher}
                </span>
                <span className="text-xs text-slate-400 font-mono">Giao tự động 3s</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                {game.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Mode Switcher: Direct vs Group Buy Top-up */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setMode('instant_direct')}
              className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'instant_direct'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>NẠP TỨC THÌ (3 GIÂY)</span>
            </button>
            <button
              onClick={() => setMode('group_topup')}
              className={`py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'group_topup'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>GOM ĐƠN SỈ (-25%)</span>
            </button>
          </div>

          {/* Account Input Section */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>{game.uidLabel}</span>
              </label>
              {verifiedCharacter && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  {verifiedCharacter}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-8 relative">
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value);
                    setVerifiedCharacter(null);
                  }}
                  placeholder={game.uidPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 font-mono text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>
              <div className="sm:col-span-4">
                <button
                  onClick={handleVerifyAccount}
                  disabled={!uid.trim() || isVerifying}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Tra Cứu Tên</span>
                </button>
              </div>
            </div>

            {/* Server Selector if applicable */}
            {game.requiresServer && game.servers && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-1">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Máy Chủ (Server)</span>
                  </label>
                  <select
                    value={selectedServer}
                    onChange={(e) => setSelectedServer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-2.5 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {game.servers.map(srv => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>

                {game.hasZoneId && (
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                      Zone ID
                    </label>
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      placeholder={game.zonePlaceholder || 'Zone ID'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-2.5 font-mono text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tier Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300">
              CHỌN GÓI NẠP & MỨC CHIẾT KHẤU
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {game.tiers.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                const tierPrice = mode === 'group_topup' ? tier.groupPrice : tier.retailPrice;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {tier.badge && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-orange-500 text-black uppercase">
                        {tier.badge}
                      </span>
                    )}

                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl shrink-0">{tier.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold font-mono text-white truncate">
                          {tier.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {tier.currencyAmount}
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-sm font-bold font-mono text-cyan-400">
                            {formatCurrency(tierPrice, user.currency)}
                          </span>
                          {mode === 'group_topup' && (
                            <span className="text-[10px] line-through text-slate-500 font-mono">
                              {formatCurrency(tier.retailPrice, user.currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provider Selection (Game4Win Direct Connector) */}
          <div className="p-3 rounded-lg bg-black/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cổng API Xử Lý:</span>
            </div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="Midasbuy API">Midasbuy Direct API (HoYoverse)</option>
              <option value="SmileOne Direct">SmileOne Fast Gateway</option>
              <option value="Garena Partner">Garena TopUp Partner</option>
              <option value="UniPin Gateway">UniPin Multi-Region</option>
            </select>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-[#090c14] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto font-mono">
            <div className="text-[11px] text-slate-400">Tổng thanh toán:</div>
            <div className="text-lg sm:text-xl font-black text-cyan-400">
              {formatCurrency(price, user.currency)}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold"
            >
              Hủy
            </button>

            <button
              onClick={handleSubmit}
              disabled={isProcessing || !uid.trim()}
              className={`flex-1 sm:flex-initial py-2.5 px-6 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                isBalanceSufficient
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-amber-500 hover:bg-amber-400 text-black'
              } disabled:opacity-50`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ĐANG BẮN LỆNH API...</span>
                </>
              ) : isBalanceSufficient ? (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{mode === 'group_topup' ? 'THAM GIA GOM NẠP SỈ' : 'XÁC NHẬN NẠP NGAY'}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>VÍ THIẾU TIỀN • NẠP THÊM</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
