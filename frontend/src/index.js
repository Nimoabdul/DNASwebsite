import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./CartContext"; // ✅ import this

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider> {/* ✅ wrap your whole app */}
      <App />
    </CartProvider>
  </React.StrictMode>
);
