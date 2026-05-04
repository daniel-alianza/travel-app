import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import "./index.css"
import { App } from "./App"
import { AppToastViewport } from "@/components/app-toast"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <AppToastViewport />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
)
