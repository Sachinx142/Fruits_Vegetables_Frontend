"use client";
import React from "react";
import Head from "next/head";

const page = () => {
  return (
    <>
      {/* MAIN CONTENT */}
      <div className="container my-5">
        <h4 className="fw-bold mb-4 text-light">➕ Add New Customer</h4>

        <div className="bg-white p-4 rounded shadow-sm">
          <form>
            <div className="row">
              {/* Customer Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. john@example.com"
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Status</label>
                <select className="form-select">
                  <option>Active</option>
                  <option>Blocked</option>
                </select>
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



            <div className="text-end mt-3">
              <button type="submit" className="btn btn-success px-4">
                💾 Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
