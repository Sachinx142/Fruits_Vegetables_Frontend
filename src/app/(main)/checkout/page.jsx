"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import api from "@/_utils/api";

const CheckoutPage = () => {
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
const [paymentMode,setPaymentMode] = useState("razorpay")


  // Order summary (replace with dynamic cart values if needed)
  const subtotal = 199.97;
  const shipping = 10.0;
  const tax = 20.0;
  const total = subtotal + shipping + tax;

  // Generate random order ID
  const generateOrderId = () => "ORDER-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const onSubmit = async (data) => {
  const orderId = generateOrderId();
  data.paymentMode = paymentMode;
  data.totalAmount = total;
  data.orderId = orderId;

  try {
    if (paymentMode === "cod") {
      // COD: Save order directly
      const res = await api.post("/payment/saveOrder", data);
      if (res.data.status === 1) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } else if (paymentMode === "razorpay") {
      // Razorpay: Create order on backend
      const res = await api.post("/payment/createRazorpayOrder", { amount: total });
      const razorpayOrder = res.data;

      // Open Razorpay checkout
      const options = {
        key: "rzp_test_RNQihUV6mItO4r",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // Save order in backend after successful payment
          const saveRes = await api.post("/payment/saveOrder", {
            ...data,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (saveRes.data.status === 1) {
            toast.success(saveRes.data.message);
          } else {
            toast.error(saveRes.data.message);
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again!");
  }
};


  return (
    <>
      <Navbar />
      <div className="container py-5 mt-5">
        <h1 className="mb-4">Checkout</h1>
        <div className="row">
          {/* Billing Info */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Billing Information</h5>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="John Doe"
                      {...register("userName",{
                         required:{
                          value:true,
                          message:"Name is required*"
                         }
                      })}
                    />
                    {errors.userName &&  <small className="text-danger">{errors.userName.message}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Email is required*"
                        }
                      })}
                    />
                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+91 9876543210"
                      {...register("phone",{
                         required:{
                          value:true,
                          message:"Phone No is required*",
                         }
                      })}
                    />
                    {errors.phone && <small className="text-danger">{errors.phone.message}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="123 Street, City"
                      {...register("fullAddress", {
                        required: {
                          value: true,
                          message: "Full Address is required*"
                        }
                      })}
                    />
                    {errors.fullAddress && <small className="text-danger">{errors.fullAddress.message}</small>}
                  </div>


                       {/* Payment Dropdown */}
                  <div className="mb-3">
                    <label className="form-label">Payment Method*</label>
                    <select
                      className="form-select"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    >
                      <option value="razorpay">Pay Online (Razorpay)</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>

                    <button type="submit" className="btn btn-primary w-100"  disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong>₹{total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
