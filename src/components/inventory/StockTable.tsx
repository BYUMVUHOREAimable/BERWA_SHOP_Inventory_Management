
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface StockItem {
  _id: string;
  productCode: string;
  productName: string;
  date: string;
  quantity: number;
  uniquePrice: number;
  totalPrice: number;
}

interface StockTableProps {
  title: string;
  items: StockItem[];
  loading: boolean;
}

const StockTable: React.FC<StockTableProps> = ({ title, items, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price (RWF)</TableHead>
                  <TableHead className="text-right">Total Price (RWF)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.productName} ({item.productCode})</TableCell>
                      <TableCell>{format(new Date(item.date), "PPP")}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.uniquePrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.totalPrice.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockTable;
