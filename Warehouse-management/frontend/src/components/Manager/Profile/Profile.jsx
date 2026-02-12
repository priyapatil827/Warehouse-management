import React, { useState, useEffect } from "react";
import "./Profile.css";
import { base_uri } from "../../../api/api";
import axios from "axios";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");

  //  LOAD DATA ON PAGE LOAD
  useEffect(() => {
    getCurrentUser();
    getEmployeeCount();
    getSupplierCount();

    const count = localStorage.getItem("totalProducts");
    if (count) setTotalProducts(count);
  }, []);

  //  FETCH CURRENT USER
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        `${base_uri}/profile/get-current-user`,
        { withCredentials: true }
      );

      if (res.data.status) {
        setCurrentUser(res.data.user);
      }
    } catch (err) {
      alert("Failed to load profile");
      console.log(err);
    }
  };

  //  FETCH EMPLOYEE COUNT
  const getEmployeeCount = async () => {
    try {
      const res = await axios.get(
        `${base_uri}/employee/get-employee`
      );

      console.log("EMP COUNT API:", res.data);

      if (Array.isArray(res.data)) {
        setTotalEmployees(res.data.length);
      } else if (Array.isArray(res.data.employees)) {
        setTotalEmployees(res.data.employees.length);
      } else if (Array.isArray(res.data.data)) {
        setTotalEmployees(res.data.data.length);
      } else {
        setTotalEmployees(0);
      }
    } catch (err) {
      console.log("Employee count error:", err);
      setTotalEmployees(0);
    }
  };

  // ✅ FETCH SUPPLIER COUNT
  const getSupplierCount = async () => {
    try {
      const res = await axios.get(
        `${base_uri}/supplier/getAll`
      );

      if (Array.isArray(res.data.suppliers)) {
        setTotalSuppliers(res.data.suppliers.length);
      } else if (Array.isArray(res.data)) {
        setTotalSuppliers(res.data.length);
      } else {
        setTotalSuppliers(0);
      }
    } catch (err) {
      setTotalSuppliers(0);
    }
  };

  //  SAVE PROFILE
  const handleSaveProfile = async () => {
    try {
      const { _id, ...updateData } = currentUser;

      const res = await axios.put(
        `${base_uri}/profile/update-user`,
        updateData
      );

      alert(res.data.message || "Profile updated!");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/*  HEADER BAR */}
        <div className="profile-header">
          <div className="header-left">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="avatar"
            />
            <div>
              <h2>{currentUser.name || "Warehouse Manager"}</h2>
              <p>Inventory & Operations Head</p>
            </div>
          </div>

          {/*  LIVE STATS */}
          <div className="header-stats">
            <span>📦 {totalProducts} Products</span>
            <span>🚚 {totalSuppliers} Suppliers</span>
            <span>👥 {totalEmployees} Employees</span>
          </div>
        </div>

        {/*  TABS */}
        <div className="profile-tabs">
          <button
            className={activeTab === "profile" ? "tab active" : "tab"}
            onClick={() => setActiveTab("profile")}
          >
            Profile Info
          </button>
          <button
            className={activeTab === "security" ? "tab active" : "tab"}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {/*  CONTENT */}
        <div className="profile-content">

          {/*  PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="tab-card">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={currentUser.name || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        name: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={currentUser.education || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        education: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={currentUser.phone || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        phone: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={currentUser.address || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        address: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Email</label>
                <input
                  type="email"
                  value={currentUser.email || ""}
                  disabled
                />
              </div>

              <button
                className="save-btn"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            </div>
          )}

          {/*  SECURITY TAB */}
          {activeTab === "security" && (
            <div className="tab-card">
              <div className="security-box">
                <h3>Login & Authentication</h3>
                <p><b>User ID:</b> {currentUser.email}</p>
                <p><b>Session:</b> Active</p>
                <p><b>Access Level:</b> Manager</p>

                <button className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
