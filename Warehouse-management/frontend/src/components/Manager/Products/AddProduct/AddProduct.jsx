import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../../../api/api.js";
import "./AddProduct.css";

export default function AddProduct({ onClose, onSuccess }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setAdding(true);
      const formData = new FormData();

      Object.keys(newProduct).forEach((key) => {
        formData.append(key, newProduct[key]);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.post(
        `${base_uri}/product/createProduct`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.status) {
        alert("Product added successfully!");
        onSuccess();
        onClose();
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="ap-overlay">
      <div className="ap-card">
        <div className="ap-header">
          <h3>Add New Product</h3>
          <button className="ap-close" onClick={onClose}>✕</button>
        </div>

        <form className="ap-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={newProduct.category}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleChange}
          />

          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <button type="submit" disabled={adding}>
            {adding ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
