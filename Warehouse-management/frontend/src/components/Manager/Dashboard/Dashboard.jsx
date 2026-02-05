// ================= IMPORTS =================
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { base_uri } from "../../../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Dashboard.css";

// ================= COLORS =================
const COLORS = [
  "#6c63ff",
  "#00c9a7",
  "#ff7a45",
  "#ffcc00",
  "#36a2eb",
  "#9b59b6",
];

// ================= EARNING DUMMY =================
const earningsData = [
  { month: "Jan", earning: 200, payment: 150 },
  { month: "Feb", earning: 400, payment: 300 },
  { month: "Mar", earning: 800, payment: 900 },
  { month: "Apr", earning: 700, payment: 500 },
  { month: "May", earning: 600, payment: 450 },
  { month: "Jun", earning: 750, payment: 600 },
];

// ================= COMPONENT =================
export default function ManagerDashboard() {
  const [productStock, setProductStock] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    fetchProductStock();
    fetchEmployees();
  }, []);

  // ================= PRODUCT STOCK =================
  const fetchProductStock = async () => {
    const res = await axios.get(
      `${base_uri}/product/getAllProducts`,
      { withCredentials: true }
    );

    const map = {};
    res.data.products?.forEach((p) => {
      map[p.category || "Other"] =
        (map[p.category || "Other"] || 0) + (p.stock || 0);
    });

    setProductStock(
      Object.keys(map).map((k) => ({ name: k, value: map[k] }))
    );
  };

  // ================= EMPLOYEE + SALARY =================
  const fetchEmployees = async () => {
    const res = await axios.get(`${base_uri}/employee/get-employee`);

    const employees =
      res.data.employees || res.data.data || res.data || [];

    const deptCount = {};
    const deptSalary = {};

    employees.forEach((e) => {
      const dept = e.department || "Other";
      const salary = Number(e.salary || 0);

      deptCount[dept] = (deptCount[dept] || 0) + 1;
      deptSalary[dept] = (deptSalary[dept] || 0) + salary;
    });

    setEmployeeData(
      Object.keys(deptCount).map((k) => ({
        name: k,
        value: deptCount[k],
      }))
    );

    setSalaryData(
      Object.keys(deptSalary).map((k) => ({
        department: k,
        salary: deptSalary[k],
      }))
    );
  };

  const totalStock = productStock.reduce((s, i) => s + i.value, 0);
  const totalEmployees = employeeData.reduce((s, i) => s + i.value, 0);

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-grid">
        {/* ===== TOP CARDS ===== */}
        <div className="card donut cyan">
          <h4>Total Categories</h4>
          <h2>{productStock.length}</h2>
          <p className="muted-light">Live</p>
        </div>

        <div className="card donut orange">
          <h4>Total Stock</h4>
          <h2>{totalStock}</h2>
          <p className="muted-light">Inventory</p>
        </div>

        <div className="card donut orange">
          <h4>Total Employee</h4>
          <h2>{totalEmployees}</h2>
          <p className="muted-light">Total Employees</p>
        </div>

        {/* ===== EARNING GRAPH ===== */}
        <div className="card large">
          <h3>Earning Reports</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={earningsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="earning" stroke="#6c63ff" strokeWidth={3} />
              <Line dataKey="payment" stroke="#ff7a45" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== PRODUCT STOCK DONUT ===== */}
        <div className="card donut">
          <h3>Product Stock</h3>
          <p className="muted">Category wise</p>

          <div className="donut-flex">
            <PieChart width={240} height={240}>
              <Pie
                data={productStock}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {productStock.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            <div className="donut-legend">
              {productStock.map((i, idx) => (
                <div className="legend-item" key={idx}>
                  <span
                    className="legend-color"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  {i.name} ({i.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== EMPLOYEE COUNT DONUT ===== */}
        <div className="card donut">
          <h3>Employees Overview</h3>
          <p className="muted">Department wise count</p>

          <div className="donut-flex">
            <PieChart width={240} height={240}>
              <Pie
                data={employeeData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {employeeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            <div className="donut-legend">
              {employeeData.map((i, idx) => (
                <div className="legend-item" key={idx}>
                  <span
                    className="legend-color"
                    style={{ background: COLORS[idx % COLORS.length] }}
                  />
                  {i.name} ({i.value})
                </div>
              ))}
            </div>
          </div>

          <h4 style={{ marginTop: 12 }}>
            Total Employees: {totalEmployees}
          </h4>
        </div>

        {/* ===== SALARY GRAPH ===== */}
        <div className="card large">
          <h3>Salary Distribution</h3>
          <p className="muted">Department wise total salary</p>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salaryData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="salary"
                stroke="#00c9a7"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}