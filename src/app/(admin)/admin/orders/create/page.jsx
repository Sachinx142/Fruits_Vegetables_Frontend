"use client";

import Head from "next/head";
import React from "react";

const page = () => {
  return (
    <>

      <div className="container my-5">
        {/* Page Heading */}
        <h2 className="fw-bold mb-4 text-light">📦 Create New Order</h2>

        <div className="bg-white p-4 rounded shadow-sm">
          <form>
            <div className="row">
              {/* Customer Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              {/* Order Date */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Order Date</label>
                <input type="date" className="form-control" />
              </div>

              {/* Product Selection */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Product(s)</label>
                <div className="row g-2">
                  <div className="col-md-6">
                    <select className="form-select">
                      <option value="">Select Product</option>
                      <option value="apple">Apple</option>
                      <option value="banana">Banana</option>
                      <option value="carrot">Carrot</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price (₹)"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Payment Status</label>
                <select className="form-select">
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Order Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Order Status</label>
                <select className="form-select">
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Order Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Any special instructions for this order..."
                />
              </div>
            </div>

               {/* SEO Section */}
        <div className="mt-5 border-top pt-4">
          <h5 className="fw-bold mb-3">🔍 SEO Section</h5>

          <div className="row g-4">
            {/* Title - Half Width */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter SEO title"
              />
            </div>
          </div>

          <div className="row g-4 mt-1">
            {/* Keywords */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Keywords</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="e.g. organic, fruits, health"
              />
            </div>

            {/* Meta Description */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Meta Description</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Meta description"
              />
            </div>
          </div>
        </div>


            {/* Submit Button */}
            <div className="text-end mt-3">
              <button type="submit" className="btn btn-success px-4">
                💾 Save Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
