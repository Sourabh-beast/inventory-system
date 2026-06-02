import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Product, ProductListResponse, ProductFormData } from "@/types";

const PRODUCTS_KEY = "products";

export function useProducts(search?: string, page = 1, pageSize = 20) {
  return useQuery<ProductListResponse>({
    queryKey: [PRODUCTS_KEY, search, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("page_size", String(pageSize));
      const { data } = await api.get(`/products?${params}`);
      return data;
    },
  });
}

export function useAllProducts() {
  return useQuery<ProductListResponse>({
    queryKey: [PRODUCTS_KEY, "all"],
    queryFn: async () => {
      const { data } = await api.get("/products?page_size=100");
      return data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation<Product, Error, ProductFormData>({
    mutationFn: async (body) => {
      const { data } = await api.post("/products", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation<Product, Error, { id: number; data: Partial<ProductFormData> }>({
    mutationFn: async ({ id, data }) => {
      const { data: res } = await api.put(`/products/${id}`, data);
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] }),
  });
}
