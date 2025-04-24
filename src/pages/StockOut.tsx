
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StockForm from "@/components/inventory/StockForm";
import StockTable from "@/components/inventory/StockTable";
import { toast } from "sonner";

interface Product {
  productCode: string;
  productName: string;
}

interface StockItem {
  _id: string;
  productCode: string;
  productName: string;
  date: string;
  quantity: number;
  uniquePrice: number;
  totalPrice: number;
}

const StockOut = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchStockOut();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again later.");
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchStockOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/product-out", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock out data");
      }

      const data = await response.json();
      setStockItems(data);
    } catch (error) {
      console.error("Error fetching stock out data:", error);
      toast.error("Failed to load stock out data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    fetchStockOut();
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Remove Stock</h2>
          {productsLoading ? (
            <div className="flex justify-center py-8">Loading products...</div>
          ) : (
            <StockForm
              products={products}
              type="out"
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Stock Out History</h2>
          <StockTable
            title="Stock Out Records"
            items={stockItems}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default StockOut;
