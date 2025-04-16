import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPage.css';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Admin access required');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load product');
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
        });
        setExistingImageUrl(data.imageUrl);
      })
      .catch((err) => {
        console.error('Error loading product:', err);
        alert(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Not authenticated');
      navigate('/login');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update product');
      }

      alert('Product updated successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  // 🗑 Handle Delete
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      alert('Product deleted successfully!');
      navigate('/admin');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting product');
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-product-container">
      <div className="edit-left">
        {imageFile ? (
          <img src={URL.createObjectURL(imageFile)} alt="Preview" />
        ) : (
          existingImageUrl && <img src={existingImageUrl} alt="Existing product" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <form className="edit-right" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={handleDelete} className="btn-danger">
            Delete Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
