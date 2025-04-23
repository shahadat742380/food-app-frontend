"use client";

import { useState, useEffect } from "react";
import { FavoriteCard } from "@/components/carts/favorite-card";
import { Axios } from "@/config/axios";
import { toast } from "sonner";
import CommonHeader from "@/components/header/common-header";
import { Skeleton } from "@/components/ui/skeleton";

// Default placeholder image - replace with your actual default image
const defaultImage = "/images/placeholder-food.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface Favorite {
  id: string;
  productId: string;
  isFavorite: boolean;
  product: Product;
}

// Skeleton loader for favorite card
const FavoriteCardSkeleton = () => (
  <div className="flex items-start gap-4 p-4 border-b border-gray-200">
    <Skeleton className="w-24 h-24 rounded-md" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  </div>
);

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/api/favorites");

        if (response.data.success) {
          setFavorites(response.data.data || []);
        } else {
          toast.error("Failed to load favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("An error occurred while loading favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      // Use the delete API endpoint
      const response = await Axios.delete(`/api/favorites/${productId}`);

      if (response.data.success) {
        // Remove the item from local state
        setFavorites(favorites.filter((item) => item.productId !== productId));
        toast.success("Removed from favorites");
      } else {
        toast.error(response.data.error || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("An error occurred while removing from favorites");
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <CommonHeader head_title="Favorite" />

      {/* Favorites List */}
      <div className="py-8">
        {loading ? (
          <div>
            {[...Array(4)].map((_, index) => (
              <FavoriteCardSkeleton key={index} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No favorites added yet</p>
          </div>
        ) : (
          <div>
            {favorites.map((item) => (
              <FavoriteCard
                key={item.id}
                id={item.productId}
                name={item.product.name}
                description={item.product.description}
                price={item.product.price}
                imageSrc={item.product.imageUrl || defaultImage}
                about=""
                isFavorite={true}
                onRemove={() => handleRemoveFromFavorites(item.productId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
