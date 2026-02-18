import React from "react";
import EmpNavbar from "../EmpNavbar/EmpNavbar";
import "./EmpBillHistory.css";

export default function EmpBillHistory() {
    const history =
        JSON.parse(localStorage.getItem("billHistory")) || [];

    return (
        <>
            <EmpNavbar />

            <div className="history-page">
                <h2 className="history-title">
                    📦 Warehouse Delivery Ledger
                </h2>
                <p className="history-subtitle">
                    Archived & closed delivery records
                </p>

                {history.length === 0 ? (
                    <div className="empty-ledger">
                        No delivered records available
                    </div>
                ) : (
                    <div className="ledger">
                        {history.map((bill, index) => {
                            const subtotal = bill.items.reduce(
                                (s, i) => s + i.price * i.quantity,
                                0
                            );
                            const gst = subtotal * 0.18;
                            const total = subtotal + gst;

                            return (
                                <div className="ledger-row" key={bill.billId}>
                                    {/* LEFT TIMELINE */}
                                    <div className="ledger-index">
                                        <span>{index + 1}</span>
                                        <div className="ledger-line"></div>
                                    </div>

                                    {/* RIGHT CONTENT */}
                                    <div className="ledger-card">
                                        <div className="ledger-top">
                                            <h3>INV-{bill.billId}</h3>
                                            <span className="status-chip">
                                                Delivered
                                            </span>
                                        </div>

                                        <div className="ledger-meta">
                                            <p><b>Employee:</b> {bill.employeeName}</p>
                                            <p><b>Date:</b> {bill.date}</p>
                                            <p><b>Items:</b> {bill.items.length}</p>
                                        </div>

                                        <div className="ledger-products">
                                            {bill.items.map((item) => (
                                                <div
                                                    className="product-line"
                                                    key={item._id}
                                                >
                                                    <span>{item.name}</span>
                                                    <span>
                                                        {item.quantity} × ₹{item.price}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="ledger-total">
                                            <p>Subtotal: ₹{subtotal}</p>
                                            <p>GST: ₹{gst.toFixed(2)}</p>
                                            <h4>Total: ₹{total.toFixed(2)}</h4>
                                        </div>
                                        {/* ===== LEDGER FOOT NOTE ===== */}
                                        <div className="ledger-footer">
                                            <p className="thank-you">
                                                Thank you for maintaining accurate delivery records.
                                            </p>
                                            <p className="footer-muted">
                                                This ledger is system-generated and intended for
                                                warehouse audit & reference purposes only.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}   