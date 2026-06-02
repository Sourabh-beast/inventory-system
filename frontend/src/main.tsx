import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1A1A28",
            color: "#E4E4F0",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 450,
            letterSpacing: "-0.01em",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#10B981", secondary: "#1A1A28" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#1A1A28" },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
