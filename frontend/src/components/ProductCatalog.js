import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCatalog.css";

const ProductCatalog = ({ category }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // State to store whether the user is an admin

  useEffect(() => {
    // Check if the user is an admin
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // Assuming role is stored as 'admin' or 'user'
    if (role === "ADMIN") {
      setIsAdmin(true); // Set to true if the user is an admin
    }

    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (category) {
          setProducts(data.filter((p) => p.category === category));
        } else {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error loading products:", err));
  }, [category]);

  // Format the heading
  const pageTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  // Handle delete product
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Update state to remove the product from the list
        setProducts(products.filter((product) => product.id !== id));
        alert("Product deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
        alert("Error deleting product.");
      });
  };

  // Handle edit product
  const handleEdit = (id) => {
    navigate(`/product/edit/${id}`); // Redirect to an edit page with the product ID
  };

  return (
    <section className="product-grid">
      <div className="container">
        <h2 className="catalog-title mb-4 text-center">{pageTitle}</h2>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col mb-4"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="product-card">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                />
                <div className="card-body p-3">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>

                  {/* Show edit and delete buttons if the user is an admin */}
                  {isAdmin && (
                    <div className="admin-actions">
                      <button
                        className="btn btn-warning"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card click event from triggering
                          handleEdit(product.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card click event from triggering
                          handleDelete(product.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
