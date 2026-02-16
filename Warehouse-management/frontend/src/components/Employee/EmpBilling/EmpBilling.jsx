import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { base_uri } from "../../../api/api";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import "./EmpBilling.css";

export default function EmpBilling() {
  const location = useLocation();
  const { orderList: initialOrderList } = location.state || { orderList: [] };

  // Get signed-in employee from localStorage
  let storedEmployee = null;
  try {
    storedEmployee = JSON.parse(localStorage.getItem("employee"));
  } catch (e) {
    console.error("Failed to parse employee from localStorage", e);
  }

  const effectiveEmployeeName = storedEmployee?.name || "";

  const [orderList, setOrderList] = useState(initialOrderList);
  const [billType, setBillType] = useState("Cash");
  const [status, setStatus] = useState("Pending");
  const [submitting, setSubmitting] = useState(false);
  const [billId, setBillId] = useState(null);
  const [savedBill, setSavedBill] = useState(null); // Card display

  // Total amount calculation
  const totalAmount = orderList.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  // Fetch existing pending bill
  useEffect(() => {
    const fetchPendingBill = async () => {
      if (!effectiveEmployeeName) return;
      try {
        const res = await axios.get(
          `${base_uri}/empBill/getAll?employeeName=${effectiveEmployeeName}`,
          { withCredentials: true }
        );

        if (res.data.status && res.data.bills.length > 0) {
          // Get first pending or processing bill
          const pendingBill = res.data.bills.find(
            (b) => b.status !== "Delivered"
          );
          if (pendingBill) {
            setBillId(pendingBill._id);
            setStatus(pendingBill.status);
            setBillType(pendingBill.billType || "Cash");

            setOrderList(
              pendingBill.products.map((p) => {
                const product = p.productId || {};
                return {
                  _id: product._id || p.productId,
                  name: product.name || "Unknown",
                  price: product.price || 0,
                  image: product.image || "",
                  quantity: p.quantity || 1,
                };
              })
            );
          }
        }
      } catch (err) {
        console.error("Error fetching bill:", err.response || err);
      }
    };

    fetchPendingBill();
  }, [effectiveEmployeeName]);

  // Update quantity of a product
  const updateQuantity = (id, qty) => {
    setOrderList(
      orderList.map((p) =>
        p._id === id ? { ...p, quantity: parseInt(qty) } : p
      )
    );
  };

  // Save or update bill
  const saveBill = async () => {
    if (orderList.length === 0) return alert("No products in the bill!");
    setSubmitting(true);

    try {
      const billData = {
        products: orderList.map((p) => ({
          productId: p._id,
          quantity: p.quantity,
        })),
        billType,
        status,
        totalAmount,
        employeeName: effectiveEmployeeName,
      };

      let res;
      if (billId) {
        // Update existing bill
        res = await axios.put(`${base_uri}/empBill/update/${billId}`, billData, {
          withCredentials: true,
        });
      } else {
        // Create new bill
        res = await axios.post(`${base_uri}/empBill/create`, billData, {
          withCredentials: true,
        });
      }

      if (res.data.status) {
        alert("Bill saved successfully!");
        setBillId(res.data.bill?._id || billId);
        setSavedBill(res.data.bill);
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      console.error("Save bill error:", err.response || err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // Download PDF
  const downloadPDF = () => {
    if (!billId) return;
    window.open(`${base_uri}/empBill/downloadPDF?billId=${billId}`, "_blank");
  };

  return (
    <>
      <EmpNavbar />
      <div className="billing-container">
        <h2>Billing</h2>
        <p>
          <strong>Employee:</strong> {effectiveEmployeeName}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>

        {orderList.length === 0 ? (
          <p className="no-data">No products selected for billing.</p>
        ) : (
          <>
            <div className="billing-products">
              {orderList.map((p) => (
                <div key={p._id} className="billing-item">
                  <img
                    src={
                      p.image
                        ? `${base_uri.replace("/api", "")}/uploads/${p.image}`
                        : "https://via.placeholder.com/60"
                    }
                    alt={p.name}
                  />
                  <div className="billing-details">
                    <h4>{p.name}</h4>
                    <p>Price: ₹{p.price}</p>
                    <p>
                      Qty:{" "}
                      {status === "Delivered" ? (
                        <span>{p.quantity}</span>
                      ) : (
                        <input
                          type="number"
                          min="1"
                          value={p.quantity}
                          onChange={(e) =>
                            updateQuantity(p._id, e.target.value)
                          }
                        />
                      )}
                    </p>
                    <p>Subtotal: ₹{p.price * p.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="billing-summary">
              <label>
                Bill Type:
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value)}
                  disabled={status === "Delivered"}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                </select>
              </label>

              <label>
                Status:
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={status === "Delivered"}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </label>

              <h3>Total Amount: ₹{totalAmount}</h3>

              {status !== "Delivered" && (
                <button
                  className="billing-btn"
                  onClick={saveBill}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save/Update Bill"}
                </button>
              )}

              {status === "Delivered" && billId && (
                <button className="billing-btn pdf-btn" onClick={downloadPDF}>
                  Download PDF
                </button>
              )}
            </div>
          </>
        )}

        {/* Saved Bill Card */}
        {savedBill && (
          <div className="saved-bill-card">
            <h3>Saved Bill</h3>
            <p>
              <strong>Bill ID:</strong> {savedBill._id}
            </p>
            <p>
              <strong>Employee:</strong> {savedBill.employeeName}
            </p>
            <p>
              <strong>Status:</strong> {savedBill.status}
            </p>
            <p>
              <strong>Total:</strong> ₹{savedBill.totalAmount}
            </p>
            <ul>
              {savedBill.products.map((p) => {
                const product = p.productId || {};
                return (
                  <li key={product._id || Math.random()}>
                    {product.name || "Unknown"} - Qty: {p.quantity} - ₹
                    {(product.price || 0) * p.quantity}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}