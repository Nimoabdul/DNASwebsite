import React from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css"; // or adjust path if needed

function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className={`footer ${isHome ? "transparent" : ""}`}>
      <p>&copy; 2025 DNAS. Nimo & Deeqa — All rights reserved.</p>
    </footer>
  );
}

export default Footer;
