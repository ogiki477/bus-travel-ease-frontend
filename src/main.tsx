// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { store } from "./store/store";


import "./index.css";

const queryClient = new QueryClient();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>   
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
