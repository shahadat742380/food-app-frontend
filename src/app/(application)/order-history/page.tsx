"use client";

import { HistoryCard } from "./_components/history-card";
import CommonHeader from "@/components/header/common-header";
import { useState, useEffect } from "react";
import { Axios } from "@/config/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for API response
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  tokenNumber: string;
  subtotal: string;
  gst: string;
  total: string;
  orderDate: string;
  status: string;
  items: OrderItem[];
}

interface Pagination {
  page: number;
  limit: number;
  total_pages: number;
  total_items: number;
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: Pagination;
  error?: string;
}

// Transform API order data to format expected by HistoryCard
const formatOrderForDisplay = (order: Order) => {
  return {
    orderId: order.orderNumber,
    date: new Date(order.orderDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    orderNumber: order.tokenNumber.replace("#", ""),
    items: order.items.map((item) => ({
      quantity: item.quantity,
      name: item.productName,
      price: Number(item.price),
    })),
    subTotal: Number(order.subtotal),
    gst: Number(order.gst),
    total: Number(order.total),
  };
};

// Skeleton loader component for order history
const OrderHistorySkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          {/* Order header */}
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          {/* Order items */}
          <div className="space-y-2 py-2">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Order totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios.get<OrdersResponse>(
        `/api/orders?page=${page}&limit=10`
      );

      if (response.data.success) {
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.data.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("An error occurred while fetching your order history");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination && page < pagination.total_pages) {
      setPage(page + 1);
    }
  };

  return (
    <main className="min-h-screen">
      <CommonHeader head_title="Order History" />

      {loading && orders.length === 0 ? (
        <OrderHistorySkeleton />
      ) : orders.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500">You don&apos;t have any orders yet</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {orders.map((order) => (
            <HistoryCard key={order.id} {...formatOrderForDisplay(order)} />
          ))}

          {pagination && page < pagination.total_pages && (
            <div className="pt-4 text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary/5"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce" />
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce" />
                    <Skeleton className="h-3 w-3 rounded-full animate-bounce" />
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;
