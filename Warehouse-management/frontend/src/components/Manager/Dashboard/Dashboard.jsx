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
  const [recentActivities, setRecentActivities] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchTeam();
    fetchActivities();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${base_uri}/product/getAllProducts`, { withCredentials: true });
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${base_uri}/employee/getAllEmployees`, { withCredentials: true });
      setTeam(res.data.employees || []);
    } catch (err) {
      console.log("Team fetch error:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${base_uri}/activity/recent`, { withCredentials: true });
      setRecentActivities(res.data.activities || []);
    } catch (err) {
      console.log("Activities fetch error:", err);
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const lowStock = products.filter((p) => p.stock < 50).length;
  const healthyStock = products.filter((p) => p.stock >= 50).length;
  const totalRevenue = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);

  return (
    <div className="warehouse-page">
      <Navbar />

      {/* ================= HERO ================= */}
      <div className="hero-carousel">
        <img src={carouselImages[current]} alt="warehouse" className="hero-image" />
        <div className="hero-overlay">
          <h1>Warehouse Manager Dashboard</h1>
          <p>Control • Analyze • Optimize Inventory</p>
        </div>
      </div>

      {/* ================= ABOUT / HIGHLIGHTS ================= */}
      <section className="about-section">
        <h2>About the Warehouse</h2>
        <p className="about-sub">
          Our warehouse spans over 50,000 sq.ft., storing thousands of products with real-time monitoring.
          The dashboard helps managers track stock, forecast needs, and optimize operations efficiently.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVMG2lmF1qKogZl8_O3gjKAVBut9vlGaO4Sg&s" alt="inventory" />
            <h3>Real-time Inventory</h3>
            <p>Monitor stock levels instantly & avoid shortages.</p>
          </div>

          <div className="about-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8dpCbpMNee8d_0Q7umu81RQXctH3yoi67eQ&s" alt="operations" />
            <h3>Efficient Operations</h3>
            <p>Manage warehouse tasks and streamline processes.</p>
          </div>

          <div className="about-card">
            <img src="https://images.unsplash.com/photo-1553413077-190dd305871c" alt="manager" />
            <h3>Manager Control</h3>
            <p>Track products, stock health, and total warehouse value.</p>
          </div>

          <div className="about-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeWD8lBHCOosB4kIo2VjznozlYcgI9htbZfw&s" alt="team" />
            <h3>Team Overview</h3>
            <p>Collaborate with your warehouse team effectively.</p>
          </div>
        </div>
      </section>

      {/* ================= KPI CARDS ================= */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Total Products</h3>
          <h2>{totalProducts}</h2>
        </div>

        <div className="kpi-card">
          <h3>Total Stock</h3>
          <h2>{totalStock}</h2>
        </div>

        <div className="kpi-card danger">
          <h3>Low Stock Items</h3>
          <h2>{lowStock}</h2>
        </div>

        <div className="kpi-card">
          <h3>Total Inventory Value</h3>
          <h2>₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* ================= MANAGER INSIGHTS ================= */}
      <div className="manager-insights">
        <h3>Manager Insights</h3>
        <div className="insight-grid">
          <div className="insight-card success">
            <h4>Healthy Stock</h4>
            <p>{healthyStock} items are stocked well</p>
          </div>

          <div className="insight-card warning">
            <h4>Attention Needed</h4>
            <p>{lowStock} items need restocking</p>
          </div>

          <div className="insight-card">
            <h4>Warehouse Value</h4>
            <p>₹{totalRevenue.toLocaleString()} total worth</p>
          </div>

          <div className="insight-card info">
            <h4>Team Members</h4>
            <p>{team.length} employees active</p>
          </div>
        </div>
      </div>

      {/* ================= RECENT ACTIVITIES ================= */}
      <section className="recent-activities">
        <h3>Recent Activities</h3>
        {recentActivities.length ? (
          <ul>
            {recentActivities.map((act, idx) => (
              <li key={idx}>
                <strong>{act.user}</strong> {act.action} <em>{new Date(act.date).toLocaleString()}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent activities.</p>
        )}
      </section>

      {/* ================= TOP PRODUCTS WITH STICKY BACKGROUND ================= */}
      <section className="top-products">
        <h3 className="title">Top Products (By Stock Value)</h3>
        <div className="product-grid">

          {/* Card 1 */}
          <div className="product-card">
            <img
              src="https://www.bbassets.com/media/uploads/p/l/255843_20-daawat-super-basmati-5-kg.jpg"
              className="product-img"
            />
            <div className="card-content">
              <h4>{products[0]?.name || "Wheat Flour 10kg"}</h4>
              <p>Stock: {products[0]?.stock || 3200}</p>
              <p>Value: ₹{products[0] ? (products[0].stock * products[0].price).toLocaleString() : "1,312,000"}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="product-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqbzLlk4YSoYG6mVXdISqE4sIxQENhlCvUVw&s"
              className="product-img"
            />
            <div className="card-content">
              <h4>{products[1]?.name || "Rice 5kg"}</h4>
              <p>Stock: {products[1]?.stock || 2800}</p>
              <p>Value: ₹{products[1] ? (products[1].stock * products[1].price).toLocaleString() : "980,000"}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="product-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNRh5eTuRe-GrAgrMWOMJ2LWvaTToswd4muw&s"
              className="product-img"
            />
            <div className="card-content">
              <h4>{products[2]?.name || "Sugar 1kg"}</h4>
              <p>Stock: {products[2]?.stock || 1500}</p>
              <p>Value: ₹{products[2] ? (products[2].stock * products[2].price).toLocaleString() : "450,000"}</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="product-card">
            <img
              src="https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSiqInIkeKoK0Cq9Lij7K3KiTrKEIjW7yv4yzKba9ur6t5l0FdkRM203TwhLYu2y_BjVi48jzuPHKtn2uMnW_FF3Aff_SqVp9NTMH19-tZD7Nwd3pka6MwDxg"
              className="product-img"
            />
            <div className="card-content">
              <h4>{products[3]?.name || "Salt 2kg"}</h4>
              <p>Stock: {products[3]?.stock || 1200}</p>
              <p>Value: ₹{products[3] ? (products[3].stock * products[3].price).toLocaleString() : "180,000"}</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="product-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQK7aPkab7XSGPFxtSmb20cOPwT5vK10W0g2lmWVD38m4vTbj4cOArJ3HGaHGgw4HiJ3c5_n-mnKET43NhTehSmp3Uzfmuu9HErdK1e50i1Td6STrjsgNXDJbM"
              className="product-img"
            />
            <div className="card-content">
              <h4>{products[4]?.name || "Oil 5L"}</h4>
              <p>Stock: {products[4]?.stock || 900}</p>
              <p>Value: ₹{products[4] ? (products[4].stock * products[4].price).toLocaleString() : "270,000"}</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="product-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTLNWD5_wzaKf6tSrgTCzwCyI7XQz74qKVY3JzEOnFS3MF183GNvmvtDVYxR5a0PZu9oSx1r0hySzXdpA6o1xZvyGH-a-If2g"
              className="product-img"
            />
            <div className="card-content">
              <h4>{products[5]?.name || "Milk 1L"}</h4>
              <p>Stock: {products[5]?.stock || 2000}</p>
              <p>Value: ₹{products[5] ? (products[5].stock * products[5].price).toLocaleString() : "400,000"}</p>
            </div>
          </div>

        </div>
      </section>

      <footer>
        <p>© 2026 Warehouse Management System | Manager Panel</p>
      </footer>
    </div>
  );
}