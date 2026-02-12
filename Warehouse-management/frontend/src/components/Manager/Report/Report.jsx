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
import "./Report.css";

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

export default function Report() {
  const [productStock, setProductStock] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);

  useEffect(() => {
    fetchProductStock();
    fetchEmployees();
    fetchSuppliers();
  }, []);

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

  const fetchSuppliers = async () => {
    const res = await axios.get(`${base_uri}/supplier/getAll`);
    const suppliers = res.data.suppliers || [];

    const statusCount = {};
    suppliers.forEach((s) => {
      const status = s.status || "Other";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    setSupplierData(
      Object.keys(statusCount).map((k) => ({
        name: k,
        value: statusCount[k],
      }))
    );
  };

  const totalStock = productStock.reduce((s, i) => s + i.value, 0);
  const totalEmployees = employeeData.reduce((s, i) => s + i.value, 0);
  const totalSuppliers = supplierData.reduce((s, i) => s + i.value, 0);

  return (
    <div className="report-page">
      <Navbar />

      <div className="report-grid">

        {/* ===== TOP 4 SUMMARY CARDS ===== */}
        <div className="report-card gradient-cyan">
          <h4>Total Categories</h4>
          <h2>{productStock.length}</h2>
        </div>

        <div className="report-card gradient-dark">
          <h4>Total Stock</h4>
          <h2>{totalStock}</h2>
        </div>

        <div className="report-card gradient-dark">
          <h4>Total Employees</h4>
          <h2>{totalEmployees}</h2>
        </div>

        <div className="report-card gradient-dark">
          <h4>Total Suppliers</h4>
          <h2>{totalSuppliers}</h2>
        </div>

        {/* ===== ALL GRAPHS BELOW ===== */}

        {/* EARNING GRAPH */}
        <div className="report-card large-card">
          <h3>Earning Overview</h3>
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

        {/* SUPPLIER DONUT */}
        <div className="report-card">
          <h3>Suppliers Overview</h3>
          <div className="donut-section">
            <div className="donut-wrapper">
              <PieChart width={240} height={240}>
                <Pie data={supplierData} dataKey="value" innerRadius={70} outerRadius={100}>
                  {supplierData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="donut-center">
                <h2>{totalSuppliers}</h2>
                <span>Suppliers</span>
              </div>
            </div>

            <div className="legend">
              {supplierData.map((i, idx) => (
                <div className="legend-item" key={idx}>
                  <span
                    style={{ background: COLORS[idx % COLORS.length] }}
                    className="legend-color"
                  />
                  {i.name} ({i.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT STOCK */}
        <div className="report-card">
          <h3>Product Stock</h3>
          <div className="donut-section">
            <div className="donut-wrapper">
              <PieChart width={240} height={240}>
                <Pie data={productStock} dataKey="value" innerRadius={70} outerRadius={100}>
                  {productStock.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="donut-center">
                <h2>{totalStock}</h2>
                <span>Total</span>
              </div>
            </div>

            <div className="legend">
              {productStock.map((i, idx) => (
                <div className="legend-item" key={idx}>
                  <span
                    style={{ background: COLORS[idx % COLORS.length] }}
                    className="legend-color"
                  />
                  {i.name} ({i.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EMPLOYEE DONUT */}
        <div className="report-card">
          <h3>Employees Overview</h3>
          <div className="donut-section">
            <div className="donut-wrapper">
              <PieChart width={240} height={240}>
                <Pie data={employeeData} dataKey="value" innerRadius={70} outerRadius={100}>
                  {employeeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="donut-center">
                <h2>{totalEmployees}</h2>
                <span>Employees</span>
              </div>
            </div>

            <div className="legend">
              {employeeData.map((i, idx) => (
                <div className="legend-item" key={idx}>
                  <span
                    style={{ background: COLORS[idx % COLORS.length] }}
                    className="legend-color"
                  />
                  {i.name} ({i.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SALARY GRAPH */}
        <div className="report-card large-card">
          <h3>Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salaryData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="salary" stroke="#00c9a7" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}