import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import { base_uri } from "../../../api/api";

const carouselImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
  "https://images.unsplash.com/photo-1590496793929-36417d3117de",
  "https://plus.unsplash.com/premium_photo-1681426745230-fdb319df08fa",
];

export default function WarehouseDashboard() {
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);

  // 🔥 AUTO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // 🔥 FETCH PRODUCTS
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
      console.log("Dashboard fetch error:", err);
    }
  };

  // 🔥 CALCULATIONS
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  );

  const lowStock = products.filter((p) => p.stock < 50).length;

  const healthyStock = products.filter((p) => p.stock >= 50).length;

  const totalRevenue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
    0
  );

  // 🔥 CATEGORY STOCK
  const categoryStock = {};
  products.forEach((p) => {
    const cat = p.category || "Other";
    categoryStock[cat] =
      (categoryStock[cat] || 0) + Number(p.stock || 0);
  });

  return (
    <div className="warehouse-page">
      <Navbar />

      {/* HERO */}
      <div className="hero-carousel">
        <img
          src={carouselImages[current]}
          alt="warehouse"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>Warehouse Management System</h1>
          <p>Track • Manage • Optimize Inventory</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Products</h3>
          <h2>{totalProducts}</h2>
        </div>

        <div className="kpi-card">
          <h3>Total Stock</h3>
          <h2>{totalStock}</h2>
        </div>

        <div className="kpi-card">
          <h3>Low Stock Items</h3>
          <h2 className="danger">{lowStock}</h2>
        </div>

        <div className="kpi-card">
          <h3>Total Inventory Value</h3>
          <h2>₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* CATEGORY STOCK */}
      <div className="card">
        <h3>Category Wise Stock</h3>

        {Object.keys(categoryStock).map((cat) => {
          const percent =
            totalStock > 0
              ? Math.round((categoryStock[cat] / totalStock) * 100)
              : 0;

          return (
            <div className="progress-item" key={cat}>
              <p>
                {cat} ({categoryStock[cat]} pcs)
              </p>
              <div className="progress-bar">
                <div style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INVENTORY HEALTH */}
      <div className="card">
        <h3>Inventory Health</h3>

        <div className="progress-item">
          <p>Healthy Stock ({healthyStock})</p>
          <div className="progress-bar">
            <div
              className="healthy-bar"
              style={{
                width:
                  totalProducts > 0
                    ? `${(healthyStock / totalProducts) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>
        </div>

        <div className="progress-item">
          <p>Low Stock ({lowStock})</p>
          <div className="progress-bar">
            <div
              className="low-bar"
              style={{
                width:
                  totalProducts > 0
                    ? `${(lowStock / totalProducts) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>
        </div>
      </div>

      <footer>
        <p>© 2026 Warehouse Management System | Built with ❤️</p>
      </footer>
    </div>
  );
}