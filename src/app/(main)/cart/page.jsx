"use client";
import React, { useEffect, useState } from "react";
import api from "@/_utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to view your cart.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }

    try {
      const res = await api.get("/cart/getCart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 1) {
        setCartItems(res.data.data);
      } else {
        setCartItems([]);
        toast.error(res.data.message || "Failed to fetch cart");
      }
    } catch (err) {
      console.error(err);

      const message = err.response?.data?.message || "Failed to fetch cart";

      if (err.response?.status === 401) {
        toast.error("Please log in again. Your token has expired!");
        localStorage.removeItem("token");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    const token = localStorage.getItem("token");
    if (!token) {
         router.push("/login");
      return;
    }
    try {
      const res = await api.post(
        "/cart/updateCart",
        { productId, qty: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 1) {
        toast.success(res.data.message);
        fetchCart();
      }
    } catch (err) {
      toast.error(res.data.message);
    }
  };

  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
      const res = await api.post(
        "/cart/deleteCart",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 1) {
        toast.success(res.data.message);
      }
      fetchCart();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  //Calculate Subcatotal GST,Tax
  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => {
      const price = Number(item.product?.finalPrice || 0);
      const qty = Number(item.qty || 0);
      return acc + price * qty;
    }, 0);

  const subtotal = calculateSubtotal();
  const shipping = cartItems.length > 0 ? 50 : 0;
  const taxRate = 0.18; // 18% GST
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;



  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <>
        <div className="d-flex flex-column justify-content-center align-items-center"  style={{ height: "70vh" }} >
          <h4 className="text-center">Loading cart...</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container py-5 my-5">
        <h1 className="text-center fw-bold display-5 my-5 text-dark">
          🛒 Your Shopping Cart
        </h1>

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4" >
              <div className="card-body">
                {cartItems?.length === 0 ? (
                  <div className="text-center my-5">
                    <img src="./icons/cart.png" className="cart-img" alt="cart-image" />
                    <h5 >Your cart is empty!</h5>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <a href="/product" className="btn btn-primary mt-3">
                      Go to Shop
                    </a>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item._id} className="row cart-item mb-3 align-items-center">
                      <div className="col-md-3">
                        <img
                          src={item.product?.productImage}
                          alt={item.product?.productName}
                          className="img-fluid rounded"
                        />
                      </div>
                      <div className="col-md-3">
                        <h5>{item.product?.productName}</h5>
                        <p className="text-muted">Category: {item?.product?.categoryId?.categoryName || "N/A"}</p>
                      </div>
                      <div className="col-md-2">
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              updateQuantity(item.product._id, item.qty - 1)
                            }
                            disabled={item.qty <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control form-control-sm text-center"
                            style={{ maxWidth: "70px" }}
                            value={item.qty}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              updateQuantity(item?.product._id, item?.qty + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2 text-end">
                        <p className="fw-bold">₹{item.total?.toFixed(2)}</p>
                      </div>
                      <div className="col-md-2 text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item.product._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Cart Summary */}
          {cartItems && cartItems.length > 0 ?
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal</span>
                    <span>₹{subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping</span>
                    <span>₹{shipping?.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax</span>
                    <span>₹{tax?.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total</strong>
                    <strong>₹{total?.toFixed(2)}</strong>
                  </div>

                  <button className="btn btn-primary w-100" onClick={() => router.push("/checkout")} >Proceed to Checkout</button>
                </div>
              </div>
            </div> : null}
        </div>
      </div>
    </>
  );
};

export default CartPage;
