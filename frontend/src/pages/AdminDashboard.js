import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('You are not authorized to access this page');
      navigate('/');
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err))
      .finally(() => setIsLoading(false));
  };

  const handleAddProduct = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    if (imageFile) formData.append('image', imageFile);

    fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setProducts([...products, data]);
        setNewProduct({ name: '', price: '', description: '', category: '' });
        setImageFile(null);
      })
      .catch(err => console.error('Error adding product:', err))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => setProducts(products.filter(product => product.id !== id)))
      .catch(err => console.error('Error deleting product:', err));
  };

  const handleEditProduct = (id) => navigate(`/edit/${id}`);

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="admin-main">
        <section className="admin-add-form">
          <div className="admin-card">
            <h2>Add New Product</h2>
            <div className="admin-field">
              <label>Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Product Image</label>
              <div className="admin-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <span>{imageFile ? imageFile.name : 'Choose file'}</span>
              </div>
              {imageFile && (
                <div className="admin-image-preview">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" />
                </div>
              )}
            </div>
            <button 
              className="admin-btn primary"
              onClick={handleAddProduct}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </section>

        <section className="admin-products">
          <div className="admin-card">
            <h2>Product List</h2>
            {isLoading && products.length === 0 ? (
              <div className="admin-loading">Loading products...</div>
            ) : (
              <div className="admin-grid">
                {products.map((product) => (
                  <div key={product.id} className="admin-card-product">
                    <div className="admin-product-img">
                      {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                    </div>
                    <div className="admin-product-info">
                      <h3>{product.name}</h3>
                      <p className="admin-price">${product.price}</p>
                      <p className="admin-category">{product.category}</p>
                      <div className="admin-product-actions">
                        <button 
                          className="admin-btn edit"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="admin-btn delete"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
