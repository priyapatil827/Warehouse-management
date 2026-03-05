import React, { useEffect, useState } from "react";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import axios from "axios";
import { base_uri } from "../../../api/api";
import "./EmpDashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function EmpDashboard() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${base_uri}/product/getAllProducts`,
        { withCredentials: true }
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===== DASHBOARD DATA ===== */

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + (p.stock || 0),
    0
  );

  const lowStock = products.filter(
    (p) => p.stock < 50
  ).length;

  /* ===== CATEGORY GRAPH ===== */

  const categoryMap = {};

  products.forEach((p) => {
    const cat = p.category || "Other";

    if (!categoryMap[cat]) {
      categoryMap[cat] = 0;
    }

    categoryMap[cat] += 1;
  });

  const chartData = Object.keys(categoryMap).map((key) => ({
    name: key,
    products: categoryMap[key]
  }));


  /* ===== STOCK GRAPH ===== */

  const stockStatus = {
    Low: 0,
    Medium: 0,
    High: 0
  };

  products.forEach((p) => {
    const stock = p.stock || 0;

    if (stock < 50) stockStatus.Low += 1;
    else if (stock < 150) stockStatus.Medium += 1;
    else stockStatus.High += 1;
  });

  const stockChartData = [
    { name: "Low Stock", items: stockStatus.Low },
    { name: "Medium Stock", items: stockStatus.Medium },
    { name: "High Stock", items: stockStatus.High }
  ];

  const stats = [
    { title: "Total Products", value: totalProducts },
    { title: "Total Stock", value: totalStock },
    { title: "Low Stock Items", value: lowStock }
  ];

  return (
    <>
      <EmpNavbar />

      <div className="dashboard-container">

        <h2>Warehouse Dashboard</h2>

        {/* ===== STATS ===== */}

        <div className="dashboard-cards">
          {stats.map((item, index) => (
            <div key={index} className="dashboard-card">
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        {/* ===== CATEGORY GRAPH ===== */}

        <div className="chart-section">
          <h3>Products by Category</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="products" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ===== STOCK GRAPH ===== */}

        <div className="chart-section">
          <h3>Stock Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="items" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  );
}