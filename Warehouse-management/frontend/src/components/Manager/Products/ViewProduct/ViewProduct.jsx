import React, { useState } from "react";
import axios from "axios";
import { base_uri } from "../../../../api/api";
import "./ViewProduct.css";

export default function ProductViewModal({ product, onClose, onRefresh }) {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({ ...product });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${base_uri}/product/deleteProduct/${product._id}`,
        { withCredentials: true }
      );
      onRefresh();
      onClose();
    } catch {
      alert("Delete failed");
    }
  };

  const handleUpdate = async () => {
  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("category", data.category || "");
    formData.append("stock", data.stock || "");
    formData.append("description", data.description || "");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await axios.put(
      `${base_uri}/product/editProduct/${product._id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data.status) {
      alert("Product updated!");
      onRefresh();
      setEdit(false);
    } else {
      alert("Update failed on server");
    }
  } catch (err) {
    console.log("UPDATE ERROR:", err.response?.data || err.message);
    alert("Update failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="pv-overlay">
      <div className="pv-card">
        <button className="pv-close" onClick={onClose}>✕</button>

        <div className="pv-left">
          <img
            src={
              data.image
                ? `${base_uri.replace("/api", "")}/uploads/${data.image}`
                : "https://via.placeholder.com/400"
            }
            alt={data.name}
          />
          {edit && (
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
          )}
        </div>

        <div className="pv-right">
          {edit ? (
            <>
              <input name="name" value={data.name} onChange={handleChange} />
              <input name="price" type="number" value={data.price} onChange={handleChange} />
              <input name="category" value={data.category || ""} onChange={handleChange} />
              <input name="stock" type="number" value={data.stock || ""} onChange={handleChange} />
              <textarea name="description" value={data.description || ""} onChange={handleChange} />
            </>
          ) : (
            <>
              <h2>{data.name}</h2>
              <p><b>Price:</b> ₹{data.price}</p>
              <p><b>Category:</b> {data.category || "Other"}</p>
              <p><b>Stock:</b> {data.stock}</p>
              <p>{data.description || "No description"}</p>
            </>
          )}

          <div className="pv-actions">
            {edit ? (
              <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button onClick={() => setEdit(true)}>Edit</button>
            )}
            <button className="danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
