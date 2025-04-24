"use client";

import { IcoPayment } from "@/assets/icon";
import CommonHeader from "@/components/header/common-header";
import PaymentDialog from "@/components/modal/payment-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Axios } from "@/config/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function PaymentPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    tokenNumber: string;
    total: number;
  } | null>(null);

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
      toast.success("Payment completed successfully!");
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
    <div className="min-h-screen relative bg-white">
      {/* Header */}
      <CommonHeader head_title="Payment" />

      <div className="h-[calc(100vh-140px)] p-4 flex flex-col items-center justify-center">
        <IcoPayment className="mb-8" />
      </div>

      {/* Checkout Button */}
      <div className="sticky bottom-5 z-50 px-4">
        <Button
          onClick={handleProcessPayment}
          className="w-full h-12 text-lg"
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed Payment"}
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
