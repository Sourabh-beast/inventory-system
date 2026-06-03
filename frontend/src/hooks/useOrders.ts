import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Order, OrderListResponse, OrderFormData } from "@/types";

const ORDERS_KEY = "orders";

export function useOrders() {
  return useQuery<OrderListResponse>({
    queryKey: [ORDERS_KEY],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data;
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<Order, Error, OrderFormData>({
    mutationFn: async (body) => {
      const { data } = await api.post("/orders", body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORDERS_KEY] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (orderId) => {
      await api.delete(`/orders/${orderId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORDERS_KEY] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
