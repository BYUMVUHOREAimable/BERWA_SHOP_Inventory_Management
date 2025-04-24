
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import { toast } from "sonner";

interface Product {
  productCode: string;
  productName: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
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
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = () => {
    fetchProducts();
    setProductToEdit(null);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {productToEdit ? "Edit Product" : "Add Product"}
          </h2>
          <ProductForm
            productToEdit={productToEdit}
            onSubmit={handleFormSubmit}
          />
          {productToEdit && (
            <div className="mt-4">
              <button
                onClick={() => setProductToEdit(null)}
                className="text-blue-500 hover:underline"
              >
                Cancel editing
              </button>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          {loading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : (
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={fetchProducts}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
