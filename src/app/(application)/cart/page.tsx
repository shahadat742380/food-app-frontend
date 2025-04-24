"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import CommonHeader from "@/components/header/common-header";
import { Typography } from "@/components/typography";
import foodImg from "@/assets/images/foods/food-1.png";
import { Button } from "@/components/ui/button";
import { IcoActive } from "@/assets/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Axios } from "@/config/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentDialog from "@/components/modal/payment-dialog";

// Define interfaces for API responses
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
  product: Product;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  taxAndFees: number;
  total: number;
}

interface CartResponse {
  success: boolean;
  data: CartData;
  error?: string;
  message?: string;
}

// Cart item skeleton component
const CartItemSkeleton = () => (
  <div className="flex items-start gap-4 p-4 border-b">
    <Skeleton className="relative w-28 h-28 rounded-md" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  </div>
);

// Bill details skeleton component
const BillDetailsSkeleton = () => (
  <div className="mt-6 px-4">
    <Skeleton className="h-6 w-32 mb-4" />

    <div className="space-y-3 bg-white border rounded-lg p-6">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex justify-between pt-3 border-t">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  </div>
);

// Types for API responses
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
}

interface OrderResponse {
  success: boolean;
  data?: {
    order: {
      id: string;
      orderNumber: string;
      tokenNumber: string;
      total: string;
      status: string;
      createdAt: string;
    };
    items: OrderItem[];
  };
  error?: string;
  message?: string;
}

interface PaymentData {
  id: string;
  orderId: string;
  amount: string;
  method: string;
  status: string;
  createdAt: string;
}

interface PaymentResponse {
  success: boolean;
  data?: PaymentData;
  error?: string;
  message?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    tokenNumber: string;
    total: number;
  } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  // Fetch cart items when component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await Axios.get<CartResponse>("/api/cart");

      if (response.data.success) {
        setCartItems(response.data.data.items);
        setCartData(response.data.data);
      } else {
        toast.error(response.data.error || "Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("An error occurred while fetching your cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id: string, delta: number) => {
    // Find the item and get current quantity
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    // If quantity didn't change, return
    if (newQuantity === item.quantity) return;

    // Optimistic UI update
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      setUpdatingItem(id);

      // Call API to update quantity
      const response = await Axios.put(`/api/cart/${id}`, {
        quantity: newQuantity,
      });

      if (response.data.success) {
        // Refresh cart to get updated totals
        fetchCartItems();

        // Show specific message based on whether item was added or removed
        if (delta > 0) {
          toast.success("Successfully added one more item");
        } else {
          toast.success("Successfully removed one item");
        }
      } else {
        // Revert changes if failed
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - delta } : item
          )
        );
        toast.error(response.data.error || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      // Revert changes if failed
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - delta } : item
        )
      );
      toast.error("An error occurred while updating cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleProcessPayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create the order
      const orderResponse = await Axios.post<OrderResponse>(
        "/api/orders/create"
      );

      if (!orderResponse.data.success) {
        toast.error(orderResponse.data.error || "Failed to create order");
        return;
      }

      const orderInfo = orderResponse.data.data?.order;

      if (!orderInfo) {
        toast.error("Order data is missing");
        return;
      }

      // Step 2: Process payment for the created order
      const paymentResponse = await Axios.post<PaymentResponse>(
        "/api/payments",
        {
          orderId: orderInfo.id,
          method: "UPI", // Default payment method
        }
      );

      if (!paymentResponse.data.success) {
        toast.error(paymentResponse.data.error || "Payment processing failed");
        return;
      }

      // Step 3: Set order data for the success dialog
      setOrderData({
        orderNumber: orderInfo.orderNumber,
        tokenNumber: orderInfo.tokenNumber.replace("#", ""), // Remove # if present
        total: Number(orderInfo.total),
      });

      // Show success dialog
      setIsOpen(true);
      // toast.success("Payment completed successfully!");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("An error occurred during payment processing");
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsOpen(false);
    // Navigate back to home page after payment
    router.push("/");
  };

  return (
    <div>
      {/* Header */}
      <CommonHeader head_title="My Cart" />

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="py-4">
          {loading ? (
            <>
              {/* Cart Items Skeleton */}
              <div>
                {[...Array(3)].map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
              </div>

              {/* Bill Details Skeleton */}
              <BillDetailsSkeleton />
            </>
          ) : cartItems.length === 0 ? (
            <div className="p-4 text-center">
              <Typography
                variant="Regular_H5"
                className="text-muted-foreground"
              >
                Your cart is empty
              </Typography>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border-b"
                  >
                    <div className="relative w-28 h-28">
                      <Image
                        src={foodImg}
                        alt={item.product.name}
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
                          <Typography
                            variant="SemiBold_H5"
                            className="text-foreground"
                          >
                            {item.product.name}
                          </Typography>
                          <Typography
                            variant="Regular_H6"
                            className="text-muted-foreground max-w-[220px] truncate"
                          >
                            {item.product.description}
                          </Typography>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <Typography
                          variant="SemiBold_H5"
                          className="text-primary"
                        >
                          ₹{Number(item.product.price).toFixed(2)}
                        </Typography>
                        <div className="flex items-center bg-primary text-white rounded-md p-1">
                          <Button
                            variant={"ghost"}
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded"
                            disabled={updatingItem === item.id}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="mx-3 font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant={"ghost"}
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center"
                            disabled={updatingItem === item.id}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              {cartData && (
                <div className="mt-6 px-4">
                  <Typography
                    variant="SemiBold_H5"
                    className="text-foreground mb-4"
                  >
                    Bill Details
                  </Typography>

                  <div className="space-y-3 bg-white border rounded-lg p-6 text-muted-foreground">
                    <div className="flex justify-between">
                      <Typography variant="Regular_H5" className="">
                        Subtotal
                      </Typography>
                      <Typography variant="Regular_H5" className="">
                        ₹{Number(cartData.subtotal).toFixed(2)}
                      </Typography>
                    </div>

                    <div className="flex justify-between">
                      <Typography variant="Regular_H6" className="">
                        Tax and Fees
                      </Typography>
                      <Typography variant="Regular_H6" className="">
                        ₹{Number(cartData.taxAndFees).toFixed(2)}
                      </Typography>
                    </div>

                    <div className="flex justify-between pt-3 border-t">
                      <Typography
                        variant="SemiBold_H5"
                        className="text-foreground"
                      >
                        Total{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({cartItems.length} items)
                        </span>
                      </Typography>
                      <Typography
                        variant="SemiBold_H5"
                        className="text-primary"
                      >
                        ₹{Number(cartData.total).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Checkout Button */}
      <div className="sticky bottom-5 z-50 px-4">
        <Button
          onClick={handleProcessPayment}
          className="w-full h-12 text-lg"
          disabled={loading || cartItems.length === 0}
        >
          {loading ? (
            <Skeleton className="h-5 w-1/2 mx-auto" />
          ) : (
            "Proceed Payment"
          )}
        </Button>
      </div>

      {orderData && (
        <PaymentDialog
          setClose={handleDialogClose}
          open={isOpen}
          userName="Customer"
          tokenNumber={orderData.tokenNumber}
          orderNumber={orderData.orderNumber}
          totalAmount={orderData.total}
        />
      )}
    </div>
  );
}
