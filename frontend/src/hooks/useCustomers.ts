import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Customer, CustomerListResponse, CustomerFormData } from "@/types";

const CUSTOMERS_KEY = "customers";

export function useCustomers(search?: string) {
  return useQuery<CustomerListResponse>({
    queryKey: [CUSTOMERS_KEY, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const { data } = await api.get(`/customers?${params}`);
      return data;
    },
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation<Customer, Error, CustomerFormData>({
    mutationFn: async (body) => {
      const { data } = await api.post("/customers", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation<Customer, Error, { id: number; data: Partial<CustomerFormData> }>({
    mutationFn: async ({ id, data }) => {
      const { data: res } = await api.put(`/customers/${id}`, data);
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] }),
  });
}
