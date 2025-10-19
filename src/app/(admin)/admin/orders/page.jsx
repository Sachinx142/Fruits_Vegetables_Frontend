// /admin/orders/page.tsx

"use client";
import Link from "next/link";
import React from "react";

const orders = [
  {
    id: "ORD12345",
    customer: "Amit Sharma",
    date: "2025-07-20",
    total: 799,
    status: "Processing",
    payment: "Paid",
  },
  {
    id: "ORD12346",
    customer: "Priya Verma",
    date: "2025-07-19",
    total: 459,
    status: "Delivered",
    payment: "Paid",
  },
];

const page = () => {
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-light">📦 Order Management</h4>
        <Link href="/admin/orders/create" className="btn btn-primary">
          ➕ Add Order
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th>Payment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>₹{order.total}</td>
                <td>
                  <span
                    className={`badge ${
                      order.status === "Delivered"
                        ? "bg-success"
                        : order.status === "Processing"
                        ? "bg-warning"
                        : "bg-secondary"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      order.payment === "Paid"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      href={`/admin/orders/view/${order.id}`}
                      className="btn btn-sm btn-info"
                    >
                      <i className="bi bi-eye" />
                    </Link>
                    <Link
                      href='/admin/orders/edit'
                      className="btn-edit"
                    >
                      <i className="bi bi-pencil" />
                    </Link>
                    <button className="btn-delete">
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
