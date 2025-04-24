
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportSummaryProps {
  stockInTotal: number;
  stockOutTotal: number;
  currentStock: number;
  productCount: number;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({
  stockInTotal,
  stockOutTotal,
  currentStock,
  productCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Stock In Value</CardDescription>
          <CardTitle className="text-2xl">{stockInTotal.toLocaleString()} RWF</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Total value of all incoming stock</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Stock Out Value</CardDescription>
          <CardTitle className="text-2xl">{stockOutTotal.toLocaleString()} RWF</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Total value of all outgoing stock</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Current Stock Value</CardDescription>
          <CardTitle className="text-2xl">{currentStock.toLocaleString()} RWF</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Value of current inventory</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl">{productCount}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Number of unique products</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportSummary;
