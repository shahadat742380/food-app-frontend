"use client";

import { Typography } from "@/components/typography";
import { Header } from "@/components/header/Header";
import { FoodCard } from "@/components/carts/FoodCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import foodImg from "@/assets/images/foods/food-1.png";
import { useEffect, useState, useCallback } from "react";
import { Axios } from "@/config/axios";
import { StaticImageData } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

// Sample quick search terms (will be replaced with actual top products)
const quickSearchTerms = ["Chole Bhature", "Idli Sambar", "Paneer Tikka"];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  about: string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    total_items: number;
  };
}

// Helper function to get image source with fallback
const getImageSource = (
  imageUrl: string | null | undefined,
  fallback: StaticImageData
): string | StaticImageData => {
  if (!imageUrl) return fallback;
  return imageUrl;
};

// Debounce function to limit API calls while typing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Skeleton loader for food cards
const FoodCardSkeleton = () => {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200 ">
      <Skeleton className="w-28 h-28 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="pt-2 flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for quick search buttons
const QuickSearchSkeleton = () => {
  return (
    <div className="flex gap-2 pb-2 px-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full" />
      ))}
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce
  const topSearchItems = quickSearchTerms; // Use the constant directly instead of state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_pages: 1,
    total_items: 0,
  });

  const fetchProducts = useCallback(async (page = 1, search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort: "name",
        order: "asc",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await Axios.get<ProductsResponse>(
        `/api/products?${params.toString()}`
      );

      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load of products
  useEffect(() => {
    fetchProducts(1);

    // In a real app, you would fetch top search items from an API
    // This is just a placeholder
  }, [fetchProducts]);

  // Fetch products when search term changes
  useEffect(() => {
    fetchProducts(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchProducts]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <main className="min-h-screen">
      <Header
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
      />

      <div className="py-8 px-6">
        <Typography variant="SemiBold_H4" className="mb-4 block">
          Top Search
        </Typography>

        <div className="relative -mx-4">
          <ScrollArea className="w-full">
            {loading && topSearchItems.length === 0 ? (
              <QuickSearchSkeleton />
            ) : (
              <div className="flex gap-2 pb-2 px-4">
                <Button
                  variant={!searchTerm ? "default" : "outline"}
                  className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap"
                  onClick={clearSearch}
                >
                  All
                </Button>
                {topSearchItems.map((term) => (
                  <Button
                    key={term}
                    variant={term === searchTerm ? "default" : "outline"}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                      term === searchTerm ? "pr-2" : ""
                    }`}
                    onClick={() => handleQuickSearch(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="mt-4 ">
              {[...Array(5)].map((_, index) => (
                <FoodCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">No products found</div>
          ) : (
            <div className="mt-4 space-y-4">
              {products.map((product) => (
                <FoodCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  imageSrc={getImageSource(product.image, foodImg)}
                  about={product.about || ""}
                  isFavorite={false}
                />
              ))}
            </div>
          )}
        </div>

        {pagination.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={loading || pagination.page === 1}
              onClick={() =>
                fetchProducts(pagination.page - 1, debouncedSearchTerm)
              }
            >
              {loading ? <Skeleton className="w-16 h-4" /> : "Previous"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading || pagination.page === pagination.total_pages}
              onClick={() =>
                fetchProducts(pagination.page + 1, debouncedSearchTerm)
              }
            >
              {loading ? <Skeleton className="w-16 h-4" /> : "Next"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
