import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPage.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Check permissions on mount
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || role !== 'admin') {
      alert('Admin privileges required');
      navigate('/');
    }
  }, [navigate]);

  // Load product data
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
        });
        setExistingImageUrl(data.imageUrl);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
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
      alert('Authentication required');
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
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Update failed');
      }

      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-product-container">
      <div className="edit-left">
        {imageFile ? (
          <img src={URL.createObjectURL(imageFile)} alt="Preview" />
        ) : (
          existingImageUrl && <img src={existingImageUrl} alt="Existing" />
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;