import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import "./EmpBilling.css";

export default function EmpBilling() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderList = [], employeeName = "Employee" } =
    location.state || {};

  const [allBills, setAllBills] = useState([]);

  /* ===============================
     LOAD / RESUME ACTIVE BILL
  =============================== */
  useEffect(() => {
    const storedBills =
      JSON.parse(localStorage.getItem("allBills")) || [];

    let activeBillId =
      localStorage.getItem("activeBillId");

    if (!activeBillId) {
      activeBillId = Date.now().toString();
      localStorage.setItem("activeBillId", activeBillId);
    }

    const existingBill = storedBills.find(
      (b) => b.billId === activeBillId
    );

    if (!existingBill && orderList.length > 0) {
      const newBill = {
        billId: activeBillId,
        employeeName,
        items: orderList,
        status: "Pending",
        date: new Date().toLocaleDateString(),
      };

      const updated = [...storedBills, newBill];
      localStorage.setItem("allBills", JSON.stringify(updated));
      setAllBills(updated);
    } else {
      setAllBills(storedBills);
    }
  }, []);

  /* ===============================
     PRODUCT CANCEL (REMOVE)
  =============================== */
  const handleRemoveProduct = (billId, productId) => {
    const updatedBills = allBills.map((bill) => {
      if (bill.billId !== billId) return bill;

      return {
        ...bill,
        items: bill.items.filter(
          (item) => item._id !== productId
        ),
      };
    });

    localStorage.setItem(
      "allBills",
      JSON.stringify(updatedBills)
    );
    setAllBills(updatedBills);
  };

  /* ===============================
     STATUS CHANGE
  =============================== */
  const handleStatusChange = (newStatus, bill) => {
    if (newStatus === "Delivered") {
      const history =
        JSON.parse(localStorage.getItem("billHistory")) || [];

      localStorage.setItem(
        "billHistory",
        JSON.stringify([...history, { ...bill, status: "Delivered" }])
      );

      const remainingBills = allBills.filter(
        (b) => b.billId !== bill.billId
      );

      localStorage.setItem(
        "allBills",
        JSON.stringify(remainingBills)
      );
      setAllBills(remainingBills);

      if (
        bill.billId ===
        localStorage.getItem("activeBillId")
      ) {
        localStorage.removeItem("activeBillId");
      }
      return;
    }

    const updatedBills = allBills.map((b) =>
      b.billId === bill.billId
        ? { ...b, status: newStatus }
        : b
    );

    localStorage.setItem(
      "allBills",
      JSON.stringify(updatedBills)
    );
    setAllBills(updatedBills);
  };

  return (
    <>
      <EmpNavbar />

      <div className="bill-container">
        {allBills
          .filter((bill) => bill.items && bill.items.length > 0)
          .map((bill, index) => {
            const subtotal = bill.items.reduce(
              (s, i) => s + i.price * i.quantity,
              0
            );
            const gst = subtotal * 0.18;
            const total = subtotal + gst;

            return (
              <div key={bill.billId} className="bill-box">
                <h2 className="center">
                  🧾 INVOICE #{index + 1}
                </h2>

                <div className="bill-info">
                  <div>
                    <p><b>Employee:</b> {bill.employeeName}</p>
                    <p><b>Date:</b> {bill.date}</p>
                    <p><b>Invoice:</b> INV-{bill.billId}</p>
                  </div>

                  <div>
                    <label><b>Status:</b></label>
                    <select
                      value={bill.status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value, bill)
                      }
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>

                {/* PRODUCTS */}
                <table className="bill-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.items.map((item, i) => (
                      <tr key={item._id}>
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td>₹{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price * item.quantity}</td>
                        <td>
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              handleRemoveProduct(
                                bill.billId,
                                item._id
                              )
                            }
                          >
                            ❌ Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bill-summary">
                  <p>Subtotal: ₹{subtotal}</p>
                  <p>GST (18%): ₹{gst.toFixed(2)}</p>
                  <h3>Grand Total: ₹{total.toFixed(2)}</h3>
                </div>
              </div>
            );
          })}

        {/* NEW BILL */}
        <div className="bill-actions">
          <button
            onClick={() => {
              localStorage.removeItem("activeBillId");
              navigate("/empProduct");
            }}
          >
            ➕ Create New Bill
          </button>
        </div>
      </div>
    </>
  );
}