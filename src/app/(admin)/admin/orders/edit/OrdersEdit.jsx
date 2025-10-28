"use client";

import api from "@/_utils/api";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const OrderEdit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")



  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();


  const orderStatus = watch("orderStatus");
  const paymentStatus = watch("paymentStatus");


  const getOrders = async () => {
    try {
      const res = await api.post("/order/getOrderByID", { id });

      if (res.data.status === 1) {
        const data = res.data.data;
        data.orderDate = data?.orderDate ? new Date(data.orderDate).toISOString().split("T")[0] : ""
        reset(data);
      }
      else {
        toast.error(res.data.error)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async (data) => {
    try {
      data.id = id
      if (data.orderStatus === "Delivered") {
        data.paymentStatus = "Paid";
      }
      const res = await api.post("/order/updateOrderDetails", data)
      if (res.data.status === 1) {
        toast.success(res.data.message);
        router.push("/admin/orders");
      }
      else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating the order.");
    }
  }


  useEffect(() => {
    if (id) {
      getOrders()
    }
  }, [id])


  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 text-primary">
        📦 Update Order Details
      </h2>

      <div className="bg-white p-4 rounded shadow-sm">
        <form>
          {/* Customer Details */}
          <h5 className="fw-bold text-secondary mb-3">👤 Customer Details</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Customer Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                readOnly
                {...register("userName")}
              />
              {errors.userName && <small className="text-danger">{errors.userName.message}</small>}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. rahul@gmail.com"
                readOnly
                {...register("email")}
              />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9876543210"
                readOnly
                {...register("phone")}
              />
              {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
            </div>
          </div>

          {/* Order Details */}
          <h5 className="fw-bold text-secondary mt-4 mb-3">📋 Order Details</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Order Date</label>
              <input type="date" className="form-control" {...register("orderDate")} />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Payment Status</label>
              <select
                {...register("paymentStatus", {
                  required: {
                    value: true,
                    message: "Select The Payment Status required*"
                  }
                })}
                className="form-select"
                disabled={orderStatus === "Delivered"}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              {errors.paymentStatus && <small className="text-danger">{errors.paymentStatus.message}</small>}

              {orderStatus === "Delivered" && (
                <small className="text-muted d-block mt-1">
                  ✅ Delivered orders are automatically marked as <strong>Paid</strong>.
                </small>
              )}
            </div>


            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Order Status</label>
              <select className="form-select" {...register("orderStatus", {
                required: {
                  value: true,
                  message: "Order Status is required*"
                }
              })}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.orderStatus && <small className="text-danger">{errors.orderStatus.message}</small>}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Delivery Address</label>
            <textarea
              className={`form-control ${errors.fullAddress ? "border-danger" : ""}`}
              rows="3"
              placeholder="Enter the Delivery Address..."
              {...register("fullAddress", {
                required: {
                  value: true,
                  message: "Delivery Address is required*"
                }
              })}
            ></textarea>
            {errors.fullAddress && <small className="text-danger">{errors.fullAddress.message}</small>}
          </div>


          {/* Submit */}
          <div className="text-end">
            <button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)} className="btn btn-success px-4">
              💾 {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEdit;
