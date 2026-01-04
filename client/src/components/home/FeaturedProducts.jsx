import React from "react";
import ProductCard from "../common/ProductCard";
import { useProduk } from "../../hooks/useProduct";

const FeaturedProducts = () => {
  const { products, loading, error } = useProduk();

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div
          className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-theme-primary-dark rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <section className="bg-app-bg py-16 md:py-20 border-t border-border-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-text-main mb-12">
          Featured
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-text-subtle">
            No Product Available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
