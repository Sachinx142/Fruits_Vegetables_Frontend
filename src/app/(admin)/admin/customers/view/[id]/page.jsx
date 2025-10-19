"use client";
import React from "react";

import { useParams } from "next/navigation";

const CustomerViewPage = () => {
    const params = useParams();
  const id = params.id;

  // Mock customer data (replace with real API or DB call)
  const customer = {
    id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    status: "Active",
    totalOrders: 5,
    lastOrderDate: "2025-07-19",
    totalSpent: 182.0,
  };

  return (
    <>

      {/* MAIN CONTENT */}
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-light">👤 Customer Details</h4>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted">Full Name</label>
              <p className="mb-0 fw-semibold">{customer.name}</p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-muted">Email</label>
              <p className="mb-0">{customer.email}</p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-muted">Phone</label>
              <p className="mb-0">{customer.phone}</p>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-muted">Status</label>
              <span
                className={`badge ${
                  customer.status === "Active" ? "bg-success" : "bg-secondary"
                }`}
              >
                {customer.status}
              </span>
            </div>
          </div>

          <hr />

          <div className="bg-light p-3 rounded">
            <h6 className="fw-bold">🧾 Order Summary</h6>
            <ul className="mb-0">
              <li>Total Orders: <strong>{customer.totalOrders}</strong></li>
              <li>Last Order Date: <strong>{customer.lastOrderDate}</strong></li>
              <li>Total Spent: <strong>${customer.totalSpent}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerViewPage;
