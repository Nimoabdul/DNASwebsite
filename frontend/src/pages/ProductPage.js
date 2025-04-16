import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Beige");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === parseInt(id));
        setProduct(found);
      })
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!isLoggedIn) {
      alert("You must be logged in to add to cart.");
      navigate("/signin");
      return;
    }

    addToCart({ ...product, size, color, quantity });
    alert("Added to cart!");
    navigate("/cart");
  };

  if (!product) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="uniqlo-product-page">
      <div className="left-gallery">
        <img src={product.imageUrl} alt={product.name} className="main-image" />
        <div className="thumbnail-row">
         
        </div>
      </div>

      <div className="right-details">
        <h1>{product.name}</h1>

        {/* Color Selector */}
        <div className="color-section">
          <label>Color:</label>
          <div className="colors">
            {["Beige", "Gray", "Black"].map((c) => (
              <div
                key={c}
                className={`color-dot ${c.toLowerCase()} ${color === c ? "active" : ""}`}
                onClick={() => setColor(c)}
              ></div>
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div className="size-section">
          <label>Size:</label>
          <div className="size-boxes">
            {["XS", "S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                className={`size-btn ${size === s ? "selected" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="price">${parseFloat(product.price).toFixed(2)}</p>
        <p className="subtext">{product.description}</p>

        {/* Quantity Selector */}
        <div className="quantity-row">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        {/* Add to Cart */}
        <button className="add-btn" onClick={handleAddToCart}>
          ADD TO CART
        </button>

        {/* Stock info */}
        <p className="stock-msg">FREE SHIPPING on $99+ or in-store pickup</p>
        <p className="store-status">Store stock status available</p>
      </div>
    </div>
  );
}

export default ProductPage;
