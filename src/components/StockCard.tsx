import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Stock } from "@/types/stock";
import { cn } from "@/lib/utils";

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export const StockCard = ({ stock, onClick }: StockCardProps) => {
  const isPositive = stock.change >= 0;

  return (
    <Card
      className="p-4 hover:bg-card/80 transition-all cursor-pointer border-border backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-foreground">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        <div className={cn("flex items-center gap-1", isPositive ? "text-success" : "text-destructive")}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-foreground">${stock.price.toFixed(2)}</span>
          <span className={cn("text-sm font-medium", isPositive ? "text-success" : "text-destructive")}>
            {isPositive ? "+" : ""}${Math.abs(stock.change).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Vol: {(stock.volume / 1000000).toFixed(2)}M</span>
          <span>Cap: {stock.marketCap}</span>
        </div>
      </div>
    </Card>
  );
};
