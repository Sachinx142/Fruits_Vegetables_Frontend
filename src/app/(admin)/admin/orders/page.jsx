// /admin/orders/page.tsx

"use client";
import DateFormatter from "@/_helper/frontend/DataFormatter";
import api from "@/_utils/api";
import { set } from "mongoose";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import  toast  from "react-hot-toast";

const page = () => {
  const [orders,setOrders] = useState([]);

  const getOrders = async () => {
      try {
         const res = await api.get("/order/getallOrdersByAdmin");
         if(res.data.status === 1){
           setOrders(res.data.data);
           toast.success(res.data.message);
         }
         else{
          toast.error(res.data.message);
         }
      } catch (error) {
         console.log(error)
      }
  }

  useEffect(()=>{
      getOrders();
  },[])

  return (
     <>
       <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-light">📦 Order Management</h4>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Total (₹)</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order,ind) => (
              <tr key={order._id || ind}>
                <td>{order?.orderId || "N/A"}</td>
                <td>{order?.userName}</td>
                <td>{DateFormatter(order.orderDate)}</td>
                <td>₹{order?.amount}</td>
                <td>{order?.paymentMethod}</td>
                <td>{order?.orderStatus}</td>
                <td>{order?.paymentStatus}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      href={{pathname:"/admin/orders/view",query:{id:order._id}}}
                      className="btn btn-sm btn-info"
                    >
                      <i className="bi bi-eye" />
                    </Link>
                    <Link
                      href={{pathname:'/admin/orders/edit',query:{id:order._id}}}
                      className="btn-edit"
                    >
                      <i className="bi bi-pencil" />
                    </Link>
                    <button className="btn-delete">
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
     </>
  );
};

export default page;
