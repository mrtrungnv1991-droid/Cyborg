export function formatCurrency(amount: number, currency: string = 'VND'): string {
  if (currency === 'USD' || currency === 'USDT') {
    const usd = (amount / 25000).toFixed(2);
    return currency === 'USDT' ? `${usd} USDT` : `$${usd}`;
  }
  if (currency === 'EUR') {
    const eur = (amount / 27000).toFixed(2);
    return `€${eur}`;
  }
  if (currency === 'JPY') {
    const jpy = Math.round(amount / 165);
    return `¥${new Intl.NumberFormat('ja-JP').format(jpy)}`;
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 8; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash + '...' + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
}

export function generateRandomKey(platform: string): string {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  if (platform === 'Steam') {
    return `ST-${rand()}-${rand()}-${rand()}`;
  }
  if (platform === 'GiftUp') {
    return `GU-50USD-${rand()}-${rand()}-${rand()}`;
  }
  return `KEY-${rand()}-${rand()}-${rand()}`;
}
