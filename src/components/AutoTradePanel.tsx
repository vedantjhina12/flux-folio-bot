import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AutoTrade, Stock } from "@/types/stock";
import { Zap, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AutoTradePanelProps {
  stocks: Stock[];
  autoTrades: AutoTrade[];
  onAddAutoTrade: (trade: Omit<AutoTrade, 'id'>) => void;
  onToggleAutoTrade: (id: string) => void;
  onRemoveAutoTrade: (id: string) => void;
}

export const AutoTradePanel = ({ stocks, autoTrades, onAddAutoTrade, onToggleAutoTrade, onRemoveAutoTrade }: AutoTradePanelProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleAddAutoTrade = () => {
    if (!selectedSymbol || !triggerPrice || !quantity) {
      toast.error("Please fill all fields");
      return;
    }

    onAddAutoTrade({
      symbol: selectedSymbol,
      type: tradeType,
      triggerPrice: parseFloat(triggerPrice),
      quantity: parseInt(quantity),
      enabled: true,
    });

    toast.success("Auto-trade rule created");
    setTriggerPrice("");
    setQuantity("1");
  };

  return (
    <Card className="p-6 bg-card border-border backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Auto-Trade Rules</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Stock Symbol</Label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - ${stock.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={tradeType} onValueChange={(value: "buy" | "sell") => setTradeType(value)}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trigger Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              placeholder="100.00"
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>
        </div>

        <Button onClick={handleAddAutoTrade} className="w-full bg-primary hover:bg-primary/90">
          Create Auto-Trade Rule
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Active Rules</h3>
        {autoTrades.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No auto-trade rules yet</p>
        ) : (
          autoTrades.map((trade) => (
            <Card key={trade.id} className="p-4 bg-secondary border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {trade.type === 'buy' ? 'BUY' : 'SELL'} {trade.quantity} {trade.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    When price {trade.type === 'buy' ? '≤' : '≥'} ${trade.triggerPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={trade.enabled}
                    onCheckedChange={() => onToggleAutoTrade(trade.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveAutoTrade(trade.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};
