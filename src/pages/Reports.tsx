import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ReportSummary from "@/components/inventory/ReportSummary";
import StockTable from "@/components/inventory/StockTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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
  stockInItems: StockItem[];
  stockOutItems: StockItem[];
}

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    stockInTotal: 0,
    stockOutTotal: 0,
    currentStock: 0,
    productCount: 0,
    stockInItems: [],
    stockOutItems: []
  });
  const [reportType, setReportType] = useState("weekly");

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/reports/${reportType}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Inventory Reports</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handlePrintReport} 
            className="w-full sm:w-auto"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportSummary
            stockInTotal={reportData.stockInTotal}
            stockOutTotal={reportData.stockOutTotal}
            currentStock={reportData.currentStock}
            productCount={reportData.productCount}
          />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="stock-in">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="stock-in">Stock In</TabsTrigger>
          <TabsTrigger value="stock-out">Stock Out</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock-in">
          <StockTable
            title={`Stock In - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`}
            items={reportData.stockInItems}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="stock-out">
          <StockTable
            title={`Stock Out - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`}
            items={reportData.stockOutItems}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Reports;
