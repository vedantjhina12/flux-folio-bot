import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stock, Transaction } from "@/types/stock";
import { toast } from "sonner";

interface TradingDialogProps {
  stock: Stock | null;
  open: boolean;
  onClose: () => void;
  onTrade: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export const TradingDialog = ({ stock, open, onClose, onTrade }: TradingDialogProps) => {
  const [quantity, setQuantity] = useState(1);

  if (!stock) return null;

  const handleTrade = (type: 'buy' | 'sell') => {
    if (quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    onTrade({
      symbol: stock.symbol,
      type,
      quantity,
      price: stock.price,
      total: stock.price * quantity,
    });

    toast.success(`${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}`);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Trade {stock.symbol}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Current Price: ${stock.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-quantity">Quantity</Label>
              <Input
                id="buy-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold text-foreground">${(stock.price * quantity).toFixed(2)}</p>
            </div>
            <Button onClick={() => handleTrade('buy')} className="w-full bg-success hover:bg-success/90">
              Buy {quantity} Shares
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity</Label>
              <Input
                id="sell-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-foreground">${(stock.price * quantity).toFixed(2)}</p>
            </div>
            <Button onClick={() => handleTrade('sell')} className="w-full bg-destructive hover:bg-destructive/90">
              Sell {quantity} Shares
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
