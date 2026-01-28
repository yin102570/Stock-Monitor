import { StockData, AssetType } from '../types';

export const mockStocks: StockData[] = [
  {
    id: '1',
    code: '600519',
    name: '贵州茅台',
    price: 1685.50,
    change: 12.30,
    changePercent: 0.74,
    volume: 1256800,
    high: 1690.00,
    low: 1675.50,
    marketCap: 2110000,
    pe: 32.5,
    type: 'stock',
    isFavorite: true,
  },
  {
    id: '2',
    code: '000858',
    name: '五粮液',
    price: 142.85,
    change: -2.15,
    changePercent: -1.48,
    volume: 985600,
    high: 145.20,
    low: 141.80,
    marketCap: 589000,
    pe: 18.5,
    type: 'stock',
    isFavorite: false,
  },
  {
    id: '3',
    code: '300750',
    name: '宁德时代',
    price: 186.25,
    change: 5.80,
    changePercent: 3.22,
    volume: 2345600,
    high: 188.50,
    low: 182.30,
    marketCap: 820000,
    pe: 24.8,
    type: 'stock',
    isFavorite: true,
  },
  {
    id: '4',
    code: '000001',
    name: '平安银行',
    price: 12.58,
    change: -0.18,
    changePercent: -1.41,
    volume: 4589000,
    high: 12.75,
    low: 12.45,
    marketCap: 2420000,
    pe: 4.8,
    type: 'stock',
    isFavorite: false,
  },
  {
    id: '5',
    code: '601318',
    name: '中国平安',
    price: 45.85,
    change: 1.25,
    changePercent: 2.81,
    volume: 3256000,
    high: 46.20,
    low: 44.80,
    marketCap: 8890000,
    pe: 7.2,
    type: 'stock',
    isFavorite: false,
  },
  {
    id: '6',
    code: '110001',
    name: '华夏成长混合',
    price: 2.845,
    change: 0.058,
    changePercent: 2.08,
    volume: 45890000,
    high: 2.865,
    low: 2.795,
    marketCap: 125000,
    pe: 15.2,
    type: 'fund',
    isFavorite: true,
  },
  {
    id: '7',
    code: '000001',
    name: '华夏成长',
    price: 3.125,
    change: -0.045,
    changePercent: -1.42,
    volume: 35670000,
    high: 3.180,
    low: 3.105,
    marketCap: 98000,
    pe: 18.5,
    type: 'fund',
    isFavorite: false,
  },
  {
    id: '8',
    code: '001632',
    name: '天弘中证电子ETF',
    price: 1.125,
    change: 0.025,
    changePercent: 2.27,
    volume: 67850000,
    high: 1.138,
    low: 1.102,
    marketCap: 156000,
    pe: 0,
    type: 'fund',
    isFavorite: false,
  },
  {
    id: '9',
    code: '161725',
    name: '招商白酒指数',
    price: 1.385,
    change: 0.042,
    changePercent: 3.13,
    volume: 28560000,
    high: 1.405,
    low: 1.365,
    marketCap: 92000,
    pe: 0,
    type: 'fund',
    isFavorite: true,
  },
  {
    id: '10',
    code: '003834',
    name: '中金消费升级',
    price: 1.875,
    change: 0.068,
    changePercent: 3.76,
    volume: 41230000,
    high: 1.905,
    low: 1.845,
    marketCap: 75000,
    pe: 0,
    type: 'fund',
    isFavorite: false,
  },
];

export const generateMockPriceHistory = (basePrice: number, days: number = 30) => {
  const history = [];
  let price = basePrice * 0.9;

  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.48) * (basePrice * 0.02);
    price = price + change;
    price = Math.max(price, basePrice * 0.85);
    price = Math.min(price, basePrice * 1.15);

    const date = new Date();
    date.setDate(date.getDate() - i);

    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
    });
  }

  return history;
};

export const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(2)} 亿`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(2)} 万`;
  }
  return value.toFixed(2);
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
