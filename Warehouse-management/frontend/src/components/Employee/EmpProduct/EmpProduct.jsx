import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_uri } from "../../../api/api";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import { useNavigate } from "react-router-dom";
import "./EmpProduct.css";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();

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

  /* ===== STOCK STATUS ===== */
  const getStatus = (stock) => {
    if (stock === 0) return "Inactive";
    if (stock < 50) return "Pending";
    if (stock < 200) return "On Sale";
    return "Active";
  };

  /* ===== ADD TO ORDER ===== */
  const addToOrder = (product) => {
    const exists = orderList.find(
      (p) => p._id === product._id
    );

    if (exists) {
      setOrderList(
        orderList.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setOrderList([
        ...orderList,
        { ...product, quantity: 1 },
      ]);
    }
  };

  return (
    <>
      <EmpNavbar />

      <div className="emp-container emp-flex">
        {/* ================= LEFT : PRODUCTS ================= */}
        <div className="emp-left">
          <h2>Products</h2>

          <div className="emp-cards">
            {products.map((p) => {
              const status = getStatus(p.stock);

              return (
                <div key={p._id} className="emp-card">
                  <img
                    src={
                      p.image
                        ? `${base_uri.replace(
                            "/api",
                            ""
                          )}/uploads/${p.image}`
                        : "https://via.placeholder.com/300x200"
                    }
                    alt={p.name}
                  />

                  <h3>{p.name}</h3>
                  <p className="price">₹{p.price}</p>

                  <p className="muted">
                    Stock: <b>{p.stock}</b> pcs
                  </p>

                  <p className="muted">
                    Category: {p.category || "Other"}
                  </p>

                  <span
                    className={`status ${status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {status}
                  </span>

                  <button onClick={() => addToOrder(p)}>
                    Add to Order
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT : ORDER PANEL ================= */}
        <div className="emp-right">
          <h3>Order Panel</h3>

          {orderList.length === 0 ? (
            <p className="no-data">No products added</p>
          ) : (
            orderList.map((p) => (
              <div key={p._id} className="order-item">
                <span>{p.name}</span>
                <span>× {p.quantity}</span>
              </div>
            ))
          )}

          {orderList.length > 0 && (
            <button
              className="billing-btn"
              onClick={() => {
                // 🔥 IMPORTANT FIX
                localStorage.removeItem("activeBillId");

                navigate("/empBilling", {
                  state: { orderList },
                });
              }}
            >
              Go to Billing
            </button>
          )}
        </div>
      </div>
    </>
  );
}