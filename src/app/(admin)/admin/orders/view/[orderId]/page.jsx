"use client";
import React from "react";

const page = () => {
  const order = {
    id: "ORD-1025",
    date: "2025-07-20",
    status: "Processing",
    customer: {
      name: "Amit Sharma",
      email: "amit@example.com",
      phone: "+91 9876543210",
      address: "123 Green Lane, Mumbai, India",
    },
    products: [
      { id: 1, name: "Apple", qty: 3, price: 5.99 },
      { id: 2, name: "Banana", qty: 5, price: 2.49 },
    ],
    totalAmount: 31.44,
  };

  return (
    <div className="container my-5">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-light">📦 Order #{order.id}</h2>
        <p className="text-muted">View full details of this order</p>
      </div>

      {/* Order Info */}
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <strong>Order Date:</strong> {order.date}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Status:</strong>{" "}
            <span className="badge bg-info">{order.status}</span>
          </div>
          <div className="col-md-6 mb-3">
            <strong>Customer:</strong> {order.customer.name}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Email:</strong> {order.customer.email}
          </div>
          <div className="col-md-6 mb-3">
            <strong>Phone:</strong> {order.customer.phone}
          </div>
          <div className="col-md-12 mb-3">
            <strong>Shipping Address:</strong> {order.customer.address}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h5 className="fw-semibold mb-3">🛒 Ordered Products</h5>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="text-end fw-bold">
                Grand Total:
              </td>
              <td className="fw-bold text-success">${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Buttons */}
      <div className="text-end mt-4">
        <button className="btn btn-outline-secondary me-2">🖨 Print</button>
        <button className="btn btn-primary">✏️ Edit</button>
      </div>
    </div>
  );
};

export default page;
