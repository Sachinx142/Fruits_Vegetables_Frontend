"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/_utils/api";
import toast from "react-hot-toast";
import DateFormatter from "@/_helper/frontend/DataFormatter";

const OrderViewPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  const getOrder = async () => {
    try {
      const res = await api.post("/order/getOrderByID", { id });
      if (res.data.status === 1) {
        setOrder(res.data.data);
      } else {
        toast.error(res.data.message || "Order not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getOrder();
  }, [id]);

  if (loading) return <p className="text-center my-5">Loading order details...</p>;
  if (!order) return <p className="text-center text-danger my-5">Order not found</p>;

  // Grand Total
  const grandTotal = order.products?.reduce((sum,item)=>{
    const price = item?.productId?.finalPrice || 0;
    const qty = item?.quantity || 1;
    return sum + price * qty;
  },0)

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary">📦 Order #{order.orderId}</h2>
        <p className="text-muted">View full details of this order</p>
      </div>

      {/* Order Info */}
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="row">
           <div className="col-md-6 mb-3">
            <strong className="text-muted">Customer:</strong> 
            <span className="fw-semibold text-dark">{order.userName}</span>
          </div>
          <div className="col-md-6 mb-3">
            <strong className="text-muted">Email:</strong>
            <span className="fw-semibold text-dark"> {order.email}</span>
          </div>
          <div className="col-md-6 mb-3">
            <strong className="text-muted">Phone:</strong>
            <span className="fw-semibold text-dark">{order.phone}</span>
          </div>
          <div className="col-md-6 mb-3">
            <strong className="text-muted">Order Date:</strong>{" "}
            <span className="fw-semibold text-dark">{DateFormatter(order?.orderDate)}</span>
          </div>
          <div className="col-md-6 mb-3">
            <strong className="text-muted">Order Status:</strong>{" "}
            <span className="badge bg-info">{order.orderStatus}</span>
          </div>
            <div className="col-md-6 mb-3">
            <strong className="text-muted">Payment Method:</strong>{" "}
            <span className="badge bg-secondary">{order.paymentMethod}</span>
          </div>
            <div className="col-md-6 mb-3">
            <strong className="text-muted">Payment Status:</strong>{" "}
            <span
              className={`badge ${
                order.paymentStatus === "Paid"
                  ? "bg-success"
                  : order.paymentStatus === "Pending"
                  ? "bg-warning text-dark"
                  : "bg-danger"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="col-md-6 mb-3">
            <strong className="text-muted">Shipping Address:</strong> 
            <span className="fw-semibold text-dark">{order.fullAddress}</span>
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
        <th>Image</th>
        <th>Product</th>
        <th>Price</th>
        <th>Qty</th>
        <th>SubTotal</th>
      </tr>
    </thead>
    <tbody>
      {order.products.map((item, idx) => {
         const price = item?.productId?.finalPrice || 0;
         const qty = item?.quantity || 1;
         const subtotal = price * qty;
        return(
            <tr key={idx}>
          <td>{idx + 1}</td>
          <td>
            <img
              src={`${item.productId?.productImage}`}
              alt={item.productId?.productName}
              style={{ width: 50, height: 50, borderRadius: 6 }}
            />
          </td>
          <td>{item.productId?.productName}</td>
          <td>₹{price?.toFixed(2)}</td>
          <td>₹{qty}</td>
          <td>₹{subtotal?.toFixed(2)}</td>
        </tr>
        )
})}
      <tr>
        <td colSpan={5} className="text-end fw-bold">Grand Total:</td>
        <td className="fw-bold text-success">₹{grandTotal?.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
</div>


      {/* Footer Buttons */}
      <div className="text-end mt-4">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => window.print()}
        >
          🖨 Print
        </button>
        <button
          className="btn btn-primary"
          onClick={() =>
            router.push(`/admin/orders/edit?id=${order._id}`)
          }
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
};

export default OrderViewPage;
