import "./StockControl.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar"
import { base_uri } from "../../../api/api";

export default function StockControl() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("in");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${base_uri}/product/getAllProducts`, {
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedId || !quantity) {
      alert("Please select product and enter quantity");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${base_uri}/product/updateStock`,
        {
          productId: selectedId,
          quantity: Number(quantity),
          type,
        },
        { withCredentials: true }
      );

      if (res.data.status) {
        alert("Stock updated ✅");
        fetchProducts();
        setQuantity("");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedId);

  return (
    <>
    <div>
      <Navbar />

      <div className="sc-container">
        <div className="sc-card">
          <h2 className="sc-title">📦 Stock Control</h2>

          {/* Product Select */}
          <select
            className="sc-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Stock Info */}
          {selectedProduct && (
            <div className="sc-stock-info">
              Current Stock: <strong>{selectedProduct.stock}</strong>
              {selectedProduct.stock === 0 && (
                <span className="sc-low"> ❌ Out of Stock</span>
              )}
              {selectedProduct.stock > 0 && selectedProduct.stock < 10 && (
                <span className="sc-low"> ⚠ Low Stock</span>
              )}
            </div>
          )}

          {/* Type Select */}
          <select
            className="sc-type-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
            <option value="adjust">Adjustment</option>
          </select>

          {/* Quantity */}
          <input
            className="sc-input"
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          {/* Button */}
          <button
            className="sc-btn"
            onClick={handleUpdateStock}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Stock"}
          </button>
        </div>
      </div>
      </div>
    </>
  );
}