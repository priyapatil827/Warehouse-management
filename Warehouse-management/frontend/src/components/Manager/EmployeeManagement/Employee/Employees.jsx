import React, { useEffect, useState } from "react";
import "./Employees.css";
import axios from "axios";
import { base_uri } from "../../../../api/api";
import Navbar from "../../Navbar/Navbar";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    salary: "",
    password: ""
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_uri}/employee/get-employee`);
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert("Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await axios.put(`${base_uri}/employee/update-employee/${editId}`, form);
        alert("Employee updated!");
        setEditId(null);
      } else {
        await axios.post(`${base_uri}/employee/add-employee`, form);
        alert("Employee added!");
      }

      fetchEmployees();
      setForm({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        salary: "",
        password: ""
      });
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      role: emp.role || "",
      salary: emp.salary || "",
      password: "" // do not show old password
    });
    setEditId(emp._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      setLoading(true);
      await axios.delete(`${base_uri}/employee/delete-employee/${id}`);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
      alert("Employee deleted");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emp-page">
      <Navbar />
      <h1>Employee Management</h1>

      <form className="emp-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
        <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required={!editId} />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : editId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      <table className="emp-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Dept</th><th>Role</th><th>Salary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length ? employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>₹{emp.salary}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: "center" }}>No employees found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}