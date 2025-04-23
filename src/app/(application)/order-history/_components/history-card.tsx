"use client";

import { Typography } from "@/components/typography";

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

interface HistoryCardProps {
  orderId: string;
  date: string;
  orderNumber: string;
  items: OrderItem[];
  subTotal: number;
  gst: number;
  total: number;
}

export const HistoryCard = ({
  orderId,
  date,
  orderNumber,
  items,
  subTotal,
  gst,
  total,
}: HistoryCardProps) => {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-dashed pb-4">
        <Typography variant="SemiBold_H5" className="text-primary">
          {orderId}
        </Typography>
        <Typography variant="Regular_H6" className="text-muted-foreground">
          {date}
        </Typography>

        <Typography variant="SemiBold_H5" className="text-primary">
          #{orderNumber}
        </Typography>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Typography variant="SemiBold_H6" className="text-primary">
                {item.quantity}x
              </Typography>
              <Typography variant="Regular_H6" className="text-muted-foreground">
                {item.name}
              </Typography>
            </div>
            <Typography variant="Regular_H6" className="text-muted-foreground">
              ₹{item.price}
            </Typography>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed " />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Typography variant="Regular_H6" className="text-muted-foreground">
            Sub total
          </Typography>
          <Typography variant="Regular_H6" className="text-muted-foreground">
            ₹{subTotal}
          </Typography>
        </div>
        <div className="flex justify-between items-center">
          <Typography variant="Regular_H6" className="text-muted-foreground">
            GST 5%
          </Typography>
          <Typography variant="Regular_H6" className="text-muted-foreground">
            ₹{gst}
          </Typography>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center bg-primary -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
        <Typography variant="SemiBold_H5" className="text-white">
          Total
        </Typography>
        <Typography variant="SemiBold_H5" className="text-white">
          ₹{total.toFixed(2)}
        </Typography>
      </div>
    </div>
  );
};
