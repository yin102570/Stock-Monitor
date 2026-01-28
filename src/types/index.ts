export type AssetType = 'stock' | 'fund';

export interface StockData {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  marketCap: number;
  pe: number;
  type: AssetType;
  isFavorite?: boolean;
}

export interface PortfolioItem {
  id: string;
  stockId: string;
  asset: StockData;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  profit: number;
  profitPercent: number;
}

export interface AlertRule {
  id: string;
  assetId: string;
  assetName: string;
  type: 'above' | 'below';
  targetPrice: number;
  isActive: boolean;
  createdAt: Date;
}

export interface TradeHistory {
  id: string;
  assetId: string;
  assetName: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  date: Date;
}
