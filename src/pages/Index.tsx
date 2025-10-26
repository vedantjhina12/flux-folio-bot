import { useState, useEffect } from "react";
import { StockCard } from "@/components/StockCard";
import { TradingDialog } from "@/components/TradingDialog";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { AutoTradePanel } from "@/components/AutoTradePanel";
import { Stock, PortfolioStock, Transaction, AutoTrade } from "@/types/stock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const INITIAL_STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.45, change: 2.34, changePercent: 1.33, volume: 52340000, marketCap: "2.8T" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.87, change: -1.12, changePercent: -0.78, volume: 24560000, marketCap: "1.8T" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 412.34, change: 5.67, changePercent: 1.39, volume: 28920000, marketCap: "3.1T" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.23, change: 3.45, changePercent: 1.98, volume: 45120000, marketCap: "1.9T" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 242.56, change: -4.23, changePercent: -1.71, volume: 98760000, marketCap: "771B" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.32, change: 8.91, changePercent: 1.83, volume: 42310000, marketCap: "1.2T" },
];

const Index = () => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [autoTrades, setAutoTrades] = useState<AutoTrade[]>([]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((stock) => {
          const changeAmount = (Math.random() - 0.5) * 2;
          const newPrice = Math.max(stock.price + changeAmount, 1);
          const newChange = newPrice - (stock.price - stock.change);
          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: (newChange / (newPrice - newChange)) * 100,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check and execute auto-trades
  useEffect(() => {
    autoTrades.forEach((trade) => {
      if (!trade.enabled) return;

      const stock = stocks.find((s) => s.symbol === trade.symbol);
      if (!stock) return;

      const shouldExecute =
        (trade.type === "buy" && stock.price <= trade.triggerPrice) ||
        (trade.type === "sell" && stock.price >= trade.triggerPrice);

      if (shouldExecute) {
        handleTrade({
          symbol: trade.symbol,
          type: trade.type,
          quantity: trade.quantity,
          price: stock.price,
          total: stock.price * trade.quantity,
        });
        // Disable the trade after execution
        setAutoTrades((prev) =>
          prev.map((t) => (t.id === trade.id ? { ...t, enabled: false } : t))
        );
      }
    });
  }, [stocks, autoTrades]);

  const handleTrade = (transaction: Omit<Transaction, "id" | "timestamp">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    if (transaction.type === "buy") {
      setPortfolio((prev) => {
        const existing = prev.find((p) => p.symbol === transaction.symbol);
        if (existing) {
          const totalQuantity = existing.quantity + transaction.quantity;
          const totalCost = existing.avgPrice * existing.quantity + transaction.total;
          return prev.map((p) =>
            p.symbol === transaction.symbol
              ? { ...p, quantity: totalQuantity, avgPrice: totalCost / totalQuantity }
              : p
          );
        } else {
          const stock = stocks.find((s) => s.symbol === transaction.symbol)!;
          return [
            ...prev,
            {
              ...stock,
              quantity: transaction.quantity,
              avgPrice: transaction.price,
            },
          ];
        }
      });
    } else {
      setPortfolio((prev) =>
        prev
          .map((p) =>
            p.symbol === transaction.symbol
              ? { ...p, quantity: p.quantity - transaction.quantity }
              : p
          )
          .filter((p) => p.quantity > 0)
      );
    }
  };

  const handleAddAutoTrade = (trade: Omit<AutoTrade, "id">) => {
    setAutoTrades((prev) => [...prev, { ...trade, id: Date.now().toString() }]);
  };

  const handleToggleAutoTrade = (id: string) => {
    setAutoTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleRemoveAutoTrade = (id: string) => {
    setAutoTrades((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Stock Market Pro</h1>
        </div>

        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="auto-trade">Auto-Trade</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={() => {
                    setSelectedStock(stock);
                    setDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioSummary portfolio={portfolio} />

            <Card className="p-6 bg-card border-border backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-foreground">Your Holdings</h2>
              {portfolio.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No holdings yet. Start trading to build your portfolio!</p>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((stock) => {
                    const currentValue = stock.price * stock.quantity;
                    const costBasis = stock.avgPrice * stock.quantity;
                    const gain = currentValue - costBasis;
                    const gainPercent = (gain / costBasis) * 100;

                    return (
                      <Card key={stock.symbol} className="p-4 bg-secondary border-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-foreground">{stock.symbol}</h3>
                            <p className="text-sm text-muted-foreground">{stock.quantity} shares @ ${stock.avgPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-foreground">${currentValue.toFixed(2)}</p>
                            <p className={`text-sm ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent.toFixed(2)}%)
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="p-6 bg-card border-border backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 text-foreground">Recent Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg border-border">
                      <div>
                        <span className={`font-semibold ${tx.type === 'buy' ? 'text-success' : 'text-destructive'}`}>
                          {tx.type.toUpperCase()}
                        </span>
                        <span className="ml-2 text-foreground">{tx.quantity} {tx.symbol}</span>
                        <span className="ml-2 text-muted-foreground text-sm">@ ${tx.price.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${tx.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{tx.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="auto-trade">
            <AutoTradePanel
              stocks={stocks}
              autoTrades={autoTrades}
              onAddAutoTrade={handleAddAutoTrade}
              onToggleAutoTrade={handleToggleAutoTrade}
              onRemoveAutoTrade={handleRemoveAutoTrade}
            />
          </TabsContent>
        </Tabs>

        <TradingDialog
          stock={selectedStock}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onTrade={handleTrade}
        />
      </div>
    </div>
  );
};

export default Index;
