import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../components/Header.css";
import { FiShoppingCart } from "react-icons/fi";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null); // ✅ role tracking
  const [searchTerm, setSearchTerm] = useState("");

  const isHome = location.pathname === "/";

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role"); // ✅ check role
    if (storedUser) {
      setUsername(storedUser);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role"); // clear role too
    setUsername(null);
    setRole(null);
    navigate("/SignIn");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className={`header ${isHome ? "transparent" : ""}`}>
      <div className="nav-container">
        <div className="logo">
          <Link to="/">DNAS</Link>
        </div>

        <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/products">View All</Link>
          <Link to="/category/tops">Tops</Link>
          <Link to="/category/bottoms">Bottoms</Link>
          <Link to="/category/shoes">Shoes</Link>

          {/* ✅ Admin Link */}
          {role === "admin" && (
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          )}

          <Link to="/cart" aria-label="Cart">
            <FiShoppingCart size={22} />
          </Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="auth-links">
            {username ? (
              <>
                <span className="welcome-msg">Welcome, {username}!</span>
                <button onClick={handleLogout} className="auth-btn">Logout</button>
              </>
            ) : (
              <Link to="/SignIn" className="auth-btn">Login</Link>
            )}
          </div>
        </nav>

        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </div>
      </div>
    </header>
  );
};

export default Header;
