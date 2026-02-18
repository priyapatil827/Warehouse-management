import React from "react";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import "./EmpReport.css";

export default function EmpReport() {
  const history =
    JSON.parse(localStorage.getItem("billHistory")) || [];

  const grandTotal = history.reduce((sum, bill) => {
    const subtotal = bill.items.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );
    const gst = subtotal * 0.18;
    return sum + subtotal + gst;
  }, 0);

  return (
    <>
      <EmpNavbar />

      <div className="report-page">
        {/* HEADER */}
        <div className="report-header">
          <h2>📊 Warehouse Delivery Report</h2>
          <p>Delivered orders summary & invoice report</p>
        </div>

        {/* SUMMARY */}
        <div className="report-summary">
          <div>
            <h4>Total Delivered Bills</h4>
            <p>{history.length}</p>
          </div>
          <div>
            <h4>Total Revenue</h4>
            <p>₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* TABLE REPORT */}
        {history.length === 0 ? (
          <p className="empty-report">
            No data available for report
          </p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice ID</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((bill, index) => {
                const subtotal = bill.items.reduce(
                  (s, i) => s + i.price * i.quantity,
                  0
                );
                const gst = subtotal * 0.18;
                const total = subtotal + gst;

                return (
                  <tr key={bill.billId}>
                    <td>{index + 1}</td>
                    <td>INV-{bill.billId}</td>
                    <td>{bill.employeeName}</td>
                    <td>{bill.date}</td>
                    <td>{bill.items.length}</td>
                    <td>₹{total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* FOOTER NOTE */}
        <div className="report-footer">
          <p>
            ✔ This is a system-generated warehouse delivery report.
          </p>
          <p className="muted">
            Generated for audit, tracking & management review.
          </p>
        </div>
      </div>
    </>
  );
}