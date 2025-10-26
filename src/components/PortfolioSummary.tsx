import { Card } from "@/components/ui/card";
import { PortfolioStock } from "@/types/stock";
import { TrendingUp, DollarSign, Package } from "lucide-react";

interface PortfolioSummaryProps {
  portfolio: PortfolioStock[];
}

export const PortfolioSummary = ({ portfolio }: PortfolioSummaryProps) => {
  const totalValue = portfolio.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0);
  const totalCost = portfolio.reduce((sum, stock) => sum + (stock.avgPrice * stock.quantity), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Portfolio Value</p>
        </div>
        <p className="text-3xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-success/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
        </div>
        <p className={`text-3xl font-bold ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
          {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)}
        </p>
        <p className={`text-sm ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
          {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
        </p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Package className="w-5 h-5 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">Holdings</p>
        </div>
        <p className="text-3xl font-bold text-foreground">{portfolio.length}</p>
        <p className="text-sm text-muted-foreground">Active Positions</p>
      </Card>
    </div>
  );
};
