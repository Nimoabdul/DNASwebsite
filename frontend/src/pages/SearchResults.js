import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Get query string
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q") || "";

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="product-grid">
      <div className="container">
        <h2 className="mb-4">Search Results for "{searchTerm}"</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
