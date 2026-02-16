import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import { useNavigate } from "react-router-dom";
import "./EmpDashboard.css";

export default function EmpDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 50).length;
  const recentlyAdded = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // last 5 added products

  return (
    <>
      <EmpNavbar />
      <div className="emp-container">
        <h2 className="emp-title">Dashboard</h2>

        {loading ? (
          <p className="no-data">Loading dashboard...</p>
        ) : (
          <>
            {/* STAT CARDS */}
            <div className="emp-cards">
              <div className="emp-card">
                <h3>{totalProducts}</h3>
                <p>Total Products</p>
              </div>

              <div className="emp-card">
                <h3>{lowStockProducts}</h3>
                <p>Low-Stock Products</p>
              </div>

              <div className="emp-card">
                <h3>{recentlyAdded.length}</h3>
                <p>Recently Added</p>
              </div>

              <div className="emp-card" onClick={() => navigate("/empProduct")} style={{ cursor: "pointer" }}>
                <h3>Go</h3>
                <p>View Products</p>
              </div>
            </div>

            {/* RECENTLY ADDED PRODUCTS */}
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "15px" }}>Recently Added Products</h3>
              {recentlyAdded.length === 0 ? (
                <p className="no-data">No products available</p>
              ) : (
                <div className="emp-cards">
                  {recentlyAdded.map((p) => (
                    <div key={p._id} className="emp-card">
                      <img
                        src={
                          p.image
                            ? `${base_uri.replace("/api", "")}/uploads/${p.image}`
                            : "https://via.placeholder.com/100"
                        }
                        alt={p.name}
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                      />
                      <h4>{p.name}</h4>
                      <p>Price: ₹{p.price}</p>
                      <p>Stock: {p.stock} pcs</p>
                      <p>Category: {p.category || "Other"}</p>
                      {p.stock < 50 && <p style={{ color: "#ffbaba", fontWeight: "bold" }}>⚠️ Low Stock!</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}