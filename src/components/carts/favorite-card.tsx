"use client";
import { Typography } from "@/components/typography";
import Image, { StaticImageData } from "next/image";
import { IcoActive, IcoLove } from "@/assets/icon";
import foodImg from "@/assets/images/foods/food-1.png";

interface FavoriteCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: StaticImageData | string;
  about: string;
  isFavorite?: boolean;
  onRemove?: () => void;
}

export const FavoriteCard = ({
  name,
  description,
  price,
  imageSrc,
  onRemove,
}: FavoriteCardProps) => {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-200">
      <div className="relative w-24 h-24">
        <Image
          src={imageSrc ? foodImg : foodImg}
          alt={name}
          height={96}
          width={96}
          className="rounded-md object-cover h-full w-full"
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
              className="text-muted-foreground mt-1 text-sm"
            >
              {description}
            </Typography>
          </div>
          <div
            className="h-8 w-8 text-primary hover:text-primary/80 duration-300 cursor-pointer flex items-center justify-center"
            onClick={onRemove}
          >
            <IcoLove className="h-6 w-6 fill-primary" />
          </div>
        </div>

        <div className="mt-2">
          <Typography variant="SemiBold_H5" className="text-primary">
            ₹{price}
          </Typography>
        </div>
      </div>
    </div>
  );
};
