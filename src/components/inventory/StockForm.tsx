
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Product {
  productCode: string;
  productName: string;
}

interface StockFormProps {
  products: Product[];
  type: "in" | "out";
  onSubmit: () => void;
}

const StockForm: React.FC<StockFormProps> = ({ products, type, onSubmit }) => {
  const [productCode, setProductCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (quantity && unitPrice) {
      const calculatedTotal = parseFloat(quantity) * parseFloat(unitPrice);
      setTotalPrice(calculatedTotal.toFixed(2));
    } else {
      setTotalPrice("");
    }
  }, [quantity, unitPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productCode || !quantity || !unitPrice) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const endpoint = type === "in" ? "product-in" : "product-out";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productCode,
          quantity: parseFloat(quantity),
          uniquePrice: parseFloat(unitPrice),
          totalPrice: parseFloat(totalPrice),
          date: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      toast.success(`Stock ${type === "in" ? "added to" : "removed from"} inventory successfully!`);
      
      // Reset form
      setProductCode("");
      setQuantity("");
      setUnitPrice("");
      setTotalPrice("");
      
      // Notify parent component
      onSubmit();
    } catch (error) {
      console.error("Stock operation error:", error);
      toast.error((error as Error).message || `Failed to process stock ${type}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "in" ? "Add Stock" : "Remove Stock"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productCode">Product</Label>
            <Select value={productCode} onValueChange={setProductCode} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.productCode} value={product.productCode}>
                    {product.productName} ({product.productCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unitPrice">Unit Price (RWF)</Label>
            <Input
              id="unitPrice"
              type="number"
              placeholder="Enter unit price"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalPrice">Total Price (RWF)</Label>
            <Input
              id="totalPrice"
              type="number"
              value={totalPrice}
              disabled
            />
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : type === "in" ? "Add to Inventory" : "Remove from Inventory"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StockForm;
