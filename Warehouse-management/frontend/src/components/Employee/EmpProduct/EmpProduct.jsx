import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import { useNavigate } from "react-router-dom";
import "./EmpProduct.css";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");

  const [orderList, setOrderList] = useState([]); // selected products
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${base_uri}/product/getAllProducts`, {
        withCredentials: true,
      });
      const productList = res.data.products || [];
      setProducts(productList);
      localStorage.setItem("totalProducts", productList.length);
    } catch (err) {
      console.log("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & sort
  let filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  if (sortOption === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortOption === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);
  if (sortOption === "stock-asc") filteredProducts.sort((a, b) => a.stock - b.stock);
  if (sortOption === "stock-desc") filteredProducts.sort((a, b) => b.stock - a.stock);

  // Add product to order
  const addToOrder = (product) => {
    const existing = orderList.find((p) => p._id === product._id);
    if (!existing) {
      setOrderList([...orderList, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, qty) => {
    setOrderList(orderList.map((p) => (p._id === id ? { ...p, quantity: parseInt(qty) } : p)));
  };

  return (
    <>
      <EmpNavbar />
      <div className="emp-container emp-flex">
        {/* LEFT: Products */}
        <div className="emp-left">
          <h2 className="emp-title">Products</h2>

          <div className="emp-section">
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {["All", ...new Set(products.map((p) => p.category).filter(Boolean))].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>

            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="stock-asc">Stock: Low → High</option>
              <option value="stock-desc">Stock: High → Low</option>
            </select>
          </div>

          {loading ? (
            <p className="no-data">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="no-data">No products found ✨</p>
          ) : (
            <div className="emp-cards">
              {filteredProducts.map((p) => (
                <div key={p._id} className="emp-card">
                  <img
                    src={
                      p.image
                        ? `${base_uri.replace("/api", "")}/uploads/${p.image}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={p.name}
                  />
                  <h3>{p.name}</h3>
                  <p>Price: ₹{p.price}</p>
                  <p>Stock: {p.stock} pcs</p>
                  <p>Category: {p.category || "Other"}</p>
                  {p.stock < 50 && (
                    <p style={{ color: "#ffbaba", fontWeight: "bold" }}>⚠️ Low Stock!</p>
                  )}
                  <button className="emp-btn" onClick={() => addToOrder(p)}>
                    Add to Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Order Panel */}
        <div className="emp-right">
          <h3>Order Panel</h3>

          {orderList.length === 0 ? (
            <p className="no-data">No products added yet</p>
          ) : (
            <div className="order-list">
              {orderList.map((p, i) => (
                <div key={p._id} className="order-item">
                  <strong>{p.name}</strong>
                  <p>Price: ₹{p.price}</p>
                  <p>
                    Qty:{" "}
                    <input
                      type="number"
                      min="1"
                      value={p.quantity}
                      onChange={(e) => updateQuantity(p._id, e.target.value)}
                    />
                  </p>
                </div>
              ))}
            </div>
          )}
          {orderList.length > 0 && (
            <button
              className="emp-btn"
              style={{ marginTop: "15px", width: "100%" }}
              onClick={() => navigate("/empBilling", { state: { orderList } })}
            >
              Go to Billing
            </button>
          )}
        </div>
      </div>
    </>
  );
}