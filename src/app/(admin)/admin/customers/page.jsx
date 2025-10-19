"use client";
import React from "react";
import Link from "next/link";

const customers = [
  {
    id: 1,
    name: "Anjali Rao",
    email: "anjali@gmail.com",
    phone: "+91 9876543210",
    orders: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Ravi Mehta",
    email: "ravi@gmail.com",
    phone: "+91 9898989898",
    orders: 3,
    status: "Blocked",
  },
];

const page = () => {
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-light">🧑‍💼 Customers</h4>
        <Link href="/admin/customers/create" className="btn btn-primary">
          ➕ Add Customer
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone}</td>
                <td>{cust.orders}</td>
                <td>
                  <span
                    className={`badge ${
                      cust.status === "Active"
                        ? "bg-success"
                        : cust.status === "Blocked"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {cust.status}
                  </span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      href={`/admin/customers/view/${cust.id}`}
                      className="btn btn-sm btn-info"
                    >
                      <i className="bi bi-eye" />
                    </Link>
                    <Link
                      href="/admin/customers/edit/"
                      className="btn btn-sm btn-warning"
                    >
                      <i className="fa fa-edit" />
                    </Link>
                    <button className="btn btn-sm btn-danger">
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No customers found.
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
