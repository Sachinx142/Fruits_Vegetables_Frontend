"use client";
import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form";
import api from "@/_utils/api";
import { useSession } from "next-auth/react";

const CheckoutPage = () => {
const session = useSession();
const id = session?.data?.user?.id;
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
const [paymentMode,setPaymentMode] = useState("razorpay")
const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
    }
    try {
      const res = await api.get("/cart/getCart", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1){
          setCartItems(res.data.data);
      }
      else {
        setCartItems([]);
      }
    } catch (err) {
      console.error(err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };


  // Order summary (replace with dynamic cart values if needed)
   const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.finalPrice || item.price || 0;
    const qty = item.qty || 0;
    return acc + price * qty;
  }, 0);
  const shipping = cartItems.length > 0 ? 50 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Generate random order ID
  const generateOrderId = () => "ORDER-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const onSubmit = async (data) => {
  const orderId = generateOrderId();
  data.paymentMode = paymentMode;
  data.totalAmount = total;
  data.orderId = orderId;
  data.userId = id || null;
  data.products = cartItems.map(item => ({
    productId:item.product._id,
    productName:item.product.productName,
    quantity:item.qty,
    price:item.product.finalPrice
  }))
  

  try {
    if (paymentMode === "cod") {
      // COD: Save order directly
      const res = await api.post("/order/saveOrder", data);
      if (res.data.status === 1) {
        toast.success(res.data.message);
        localStorage.removeItem("cart");
        setCartItems([]);
      } else {
        toast.error(res.data.message);
      }
    } else if (paymentMode === "razorpay") {
      const res = await api.post("/order/createRazorpayOrder", { amount: total });
      const razorpayOrder = res.data.data;

      if (res.data.status === 0) {
      toast.error(res.data.message || "Failed to create Razorpay order");
      return;
    }

      // Open Razorpay checkout
      const options = {
        key: "rzp_test_RNQihUV6mItO4r",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Fruits & Vegetables Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // Save order in backend after successful payment
          try {
               const saveRes = await api.post("/order/saveOrder", {
            ...data,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            paymentStatus: "Paid",
            orderStatus: "Processing",
          });
           if (saveRes.data.status === 1) {
            toast.success(saveRes.data.message);
            localStorage.removeItem("cart");
            setCartItems([]);
          } else {
            toast.error(saveRes.data.message || "Failed to save order");
          }
          } catch (error) {
             console.error("Save order after success error:", err);
          toast.error("Error saving order after payment!");
          } 
        },
      modal: {
        ondismiss: async function () {
          toast.error("Payment cancelled or failed. Please try again.");
        },
      },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
         rzp.on("payment.failed", async function (response) {
      console.warn("❌ Payment failed:", response);
      toast.error("Payment failed. Saving order as Failed...");

      try {
        await api.post("/order/saveOrder", {
          ...data,
          razorpay_order_id: response.error.metadata.order_id,
          razorpay_payment_id: response.error.metadata.payment_id,
          paymentStatus: "Failed",
          orderStatus: "Cancelled",
        });

        toast.error("Order saved as Failed.");
      } catch (error) {
        console.error("❌ Failed to save failed order:", error);
        toast.error("Unable to save failed order, please try again.");
      }
    });

    rzp.open();
    }
  } catch (error) {
    console.error("Razorpay init error:",error);
    toast.error("Something went wrong. Please try again!");
  }
};

useEffect(()=>{
   fetchCart();
},[])


  if (loading) return (
    <>
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <h4>Loading...</h4>
      </div>
    </>
  );


  return (
    <>
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
    </>
  );
};

export default CheckoutPage;
