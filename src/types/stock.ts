export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
}

export interface PortfolioStock extends Stock {
  quantity: number;
  avgPrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  total: number;
}

export interface AutoTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  triggerPrice: number;
  quantity: number;
  enabled: boolean;
}
