
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ProductFormProps {
  productToEdit?: {
    productCode: string;
    productName: string;
  } | null;
  onSubmit: () => void;
}

const ProductForm = ({ productToEdit, onSubmit }: ProductFormProps) => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProductCode(productToEdit.productCode);
      setProductName(productToEdit.productName);
    }
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productCode || !productName) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const url = productToEdit
        ? `http://localhost:5000/api/products/${productToEdit.productCode}`
        : "http://localhost:5000/api/products";
      
      const method = productToEdit ? "PUT" : "POST";
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productCode,
          productName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      toast.success(`Product ${productToEdit ? "updated" : "added"} successfully!`);
      
      // Reset form fields
      if (!productToEdit) {
        setProductCode("");
        setProductName("");
      }
      
      // Notify parent component
      onSubmit();
    } catch (error) {
      console.error("Product operation error:", error);
      toast.error((error as Error).message || "Failed to process product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productToEdit ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productCode">Product Code</Label>
            <Input
              id="productCode"
              placeholder="Enter product code"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              required
              disabled={!!productToEdit}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : productToEdit ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
