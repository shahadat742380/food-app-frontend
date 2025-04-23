"use client";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { useState, useEffect } from "react";
import { FoodDialog } from "../modal/FoodDialog";
import { IcoActive, IcoLove } from "@/assets/icon";
import { cn } from "@/lib/utils";
import { Axios } from "@/config/axios";
import { toast } from "sonner";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: StaticImageData | string;
  about: string;
  isFavorite?: boolean;
}

interface FavoriteData {
  id: string;
  userId: string;
  productId: string;
  isFavorite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FavoriteResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: string;
  data?: FavoriteData | { productId: string; isFavorite: boolean };
}

export const FoodCard = ({
  id,
  name,
  description,
  price,
  imageSrc,
  about,
  isFavorite = false,
}: FoodCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoveActive, setIsLoveActive] = useState(isFavorite);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        setIsLoading(true);
        const response = await Axios.get<FavoriteResponse>(
          `/api/favorites/single/${id}`
        );

        if (response.data.success && response.data.data) {
          const favoriteData = response.data.data as {
            productId: string;
            isFavorite: boolean;
          };
          setIsLoveActive(favoriteData.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [id]);

  const handleLoveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUpdatingFavorite) return;

    try {
      setIsUpdatingFavorite(true);

      const response = await Axios.post<FavoriteResponse>(
        "/api/favorites/add",
        {
          productId: id,
        }
      );

      if (response.data.success) {
        const newState = !isLoveActive;
        setIsLoveActive(newState);

        if (newState) {
          toast.success(
            response.data.message || "Product added to your favorites"
          );
        } else {
          toast.success(
            response.data.message || "Product removed from your favorites"
          );
        }
      } else {
        toast.error(response.data.error || "Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <>
      <div className="flex items-start gap-4 pb-4 border-b border-gray-200 cursor-pointer">
        <div className="relative w-28 h-28">
          <Image
            src={imageSrc}
            alt={name}
            height={110}
            width={110}
            className="rounded-md object-cover"
          />

          <div className="absolute top-1 left-1 bg-white rounded-sm p-0.5">
            <IcoActive />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="SemiBold_H5" className="text-foreground">
                {name}
              </Typography>
              <Typography
                variant="Regular_H6"
                className="text-muted-foreground mt-1"
              >
                {description}
              </Typography>
            </div>
            <button
              type="button"
              className={cn(
                "h-8 w-8 cursor-pointer flex items-center justify-center",
                isLoveActive
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground hover:text-muted-foreground"
              )}
              onClick={handleLoveClick}
              disabled={isUpdatingFavorite || isLoading}
            >
              <IcoLove />
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Typography variant="SemiBold_H5" className="text-primary">
              ₹{price}
            </Typography>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-primary hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
            >
              + Add
            </Button>
          </div>
        </div>
      </div>

      <FoodDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        name={name}
        description={description}
        price={price}
        imageSrc={imageSrc}
        about={about}
        id={id}
      />
    </>
  );
};
