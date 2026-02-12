import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { base_uri } from "../../../api/api.js";
import "./Supplier.css";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);

  const fetchSuppliers = async () => {
    const res = await axios.get(`${base_uri}/supplier/getAll`);
    setSuppliers(res.data.suppliers);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${base_uri}/supplier/update/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`${base_uri}/supplier/add`, form);
    }

    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "Active",
    });

    fetchSuppliers();
  };

  const handleEdit = (supplier) => {
    setForm(supplier);
    setEditId(supplier._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${base_uri}/supplier/delete/${id}`);
    fetchSuppliers();
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sup-page">
      <Navbar />

      <div className="sup-container">
        <div className="sup-top">
          <h2>Suppliers</h2>
          <input
            placeholder="Search supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ADD / UPDATE FORM */}
        <div className="sup-form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button onClick={handleSubmit}>
            {editId ? "Update Supplier" : "Add Supplier"}
          </button>
        </div>

        {/* TABLE */}
        <div className="sup-table-wrapper">
          <table className="sup-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.company}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>
                    <span className={`status ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}