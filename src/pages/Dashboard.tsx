
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ReportSummary from "@/components/inventory/ReportSummary";
import StockTable from "@/components/inventory/StockTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface StockItem {
  _id: string;
  productCode: string;
  productName: string;
  date: string;
  quantity: number;
  uniquePrice: number;
  totalPrice: number;
}

interface ReportData {
  stockInTotal: number;
  stockOutTotal: number;
  currentStock: number;
  productCount: number;
  recentStockIn: StockItem[];
  recentStockOut: StockItem[];
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ReportData>({
    stockInTotal: 0,
    stockOutTotal: 0,
    currentStock: 0,
    productCount: 0,
    recentStockIn: [],
    recentStockOut: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reports/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <ReportSummary
        stockInTotal={dashboardData.stockInTotal}
        stockOutTotal={dashboardData.stockOutTotal}
        currentStock={dashboardData.currentStock}
        productCount={dashboardData.productCount}
      />

      <div className="mt-8">
        <Tabs defaultValue="stock-in">
          <TabsList className="mb-4">
            <TabsTrigger value="stock-in">Recent Stock In</TabsTrigger>
            <TabsTrigger value="stock-out">Recent Stock Out</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stock-in">
            <StockTable
              title="Recent Stock In"
              items={dashboardData.recentStockIn}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="stock-out">
            <StockTable
              title="Recent Stock Out"
              items={dashboardData.recentStockOut}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
