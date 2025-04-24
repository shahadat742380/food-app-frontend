"use client";

import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image, { StaticImageData } from "next/image";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { IcoActive } from "@/assets/icon";
import { Axios } from "@/config/axios";
import { toast } from "sonner";

interface FoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description: string;
  price: number;
  imageSrc: string | StaticImageData;
  about: string;
  id: string;
}

export const FoodDialog = ({
  isOpen,
  onClose,
  name,
  description,
  price,
  imageSrc,
  about,
  id,
}: FoodDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      const response = await Axios.post("/api/cart/add", {
        productId: id,
        quantity: quantity,
      });

      if (response.data.success) {
        toast.success(`${quantity}x ${name} added to cart`);
        onClose();
      } else {
        toast.error(response.data.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("An error occurred while adding item to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[340px] !p-0 border-none rounded-xl ">
        <DialogHeader>
          <div className="relative w-full h-52 overflow-hidden rounded-t-xl">
            <Image src={imageSrc} alt={name} fill className="object-cover " />

            <div className="absolute top-4 left-4">
              <IcoActive />
            </div>
          </div>
          <div className="px-4">
            <DialogTitle className="text-start text-xl mt-2">
              {name}
            </DialogTitle>
            <DialogDescription className="text-sm text-start">
              {description}
            </DialogDescription>
            <Typography
              variant="SemiBold_H5"
              className="text-start mt-4 block text-primary"
            >
              ₹{price * quantity}
            </Typography>
            <div className="mt-6">
              <Typography
                variant="Regular_H6"
                className="text-muted-foreground text-start"
              >
                {about
                  ? about
                  : "A timeless South Indian classic, Plain Dosa is a thin, crispy crepe made from a fermented rice and urad dal batter. Light, golden, and served with chutney and sambar, it's the perfect choice for a traditional breakfast or light meal."}
              </Typography>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-between items-center gap-4 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrement}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
