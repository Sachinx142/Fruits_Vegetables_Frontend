"use client"
import DateFormatter from '@/_helper/frontend/DataFormatter'
import api from '@/_utils/api'
import Footer from '@/component/Footer'
import Navbar from '@/component/Navbar'
import { debounce } from 'lodash'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'

const page = () => {
  const session = useSession();
  const id = session?.data?.user?.id;
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatus, setOrderStatus] = useState('')


  const getallOrders = async () => {
    try {
      const res = await api.post('/order/getOrdersByUserId', {
        userId: id
      })
      if (res.data.status === 1) {
        setOrdersDetails(res.data.data);
        setFilteredOrders(res.data.data);
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (id) {
      getallOrders();
    }
  }, [id])

  // Debounce search functionality
  const handleSearch = useCallback(debounce((term, orders, statusFilter) => {
    let filtered = orders;
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toString().toLowerCase().includes(lowerTerm) ||
          order.products.some(
            (p) =>
              p.productId?.productName
                ?.toString()
                .toLowerCase()
                .includes(lowerTerm) ||
              p.quantity?.toString().toLowerCase().includes(lowerTerm) ||

              (order.orderDate ? DateFormatter(order.orderDate).toLowerCase().includes(lowerTerm) : false)
          )
      );
    }

    // Search to Dropdown for status 
    if (statusFilter) {
      filtered = filtered.filter((order) =>
        order?.orderStatus?.toLowerCase() === statusFilter.toLowerCase()
      )
    };
    setFilteredOrders(filtered);
  }, 500),
    []
  );

  useEffect(() => {
    handleSearch(searchTerm, ordersDetails, orderStatus);
  }, [searchTerm, orderStatus, ordersDetails])

  // calculate all total Price
  const computeOrderTotals = (order) => {
    const subtotal = order.products.reduce((acc, p) => {
      const price = Number(p.productId.finalPrice ?? p.productId?.actualPrice ?? 0);
      const qty = Number(p.quantity ?? 0);
      return acc + price * qty
    }, 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const gstRate = 0.18;
    const gst = subtotal * gstRate;
    const total = subtotal + gst + shipping;
    return { subtotal, gst, shipping, total };
  }


  return (
    <>
      <Navbar />
      <div className="container order-page-margin">
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0"><i className="bi bi-box-seam me-2"></i>Your Orders</h4>
          </div>

          <div className="card-body bg-light">
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <input type="text" className="form-control form-control-lg" placeholder="🔍 Search Order ID or Product Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select className="form-select form-select-lg"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  <option value="">Filter by Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                  <img
                    src="/img/no-data.png"
                    alt="No data found"
                    className="img-fluid mb-3"
                    width={400}
                    height={300}
                    style={{ maxWidth: "100%", objectFit: "contain" }}
                  />
                  <h5 className="text-muted">No orders found</h5>
                </div>
              ) : (
                <table className="table table-hover table-bordered align-middle text-center">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Base Amount (₹)</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredOrders.map((order) => {
                      const { subtotal, gst, shipping, total } = computeOrderTotals(order);
                      return (
                        <React.Fragment key={order._id || order.orderId}>
                          {order.products?.map((item, index) => {
                            const price = Number(item.productId?.finalPrice ?? item.productId?.actualPrice ?? 0);
                            const lineTotal = price * Number(item.quantity ?? 0);
                            return (
                              <tr key={item._id || index}>
                                <td>{order.orderId}</td>
                                <td>{item?.productId?.productName || "N/A"}</td>
                                <td>
                                  <img
                                    src={
                                      item.productId
                                        ? item.productId.productImage
                                        : 'https://via.placeholder.com/50'
                                    }
                                    alt={
                                      item.productId
                                        ? item.productId.productName
                                        : 'Product Image'
                                    }
                                    width="50"
                                    height="50"
                                  />
                                </td>
                                <td>{item.quantity}</td>
                                <td>₹{lineTotal.toFixed(2)}</td>
                                <td>
                                  <span className={`badge ${order.paymentStatus === "Paid" ? "bg-success" : order.paymentStatus === "Pending" ? "bg-warning text-dark" : "bg-danger"}`}>
                                    {order.paymentStatus}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${order.orderStatus === 'Delivered' ? 'bg-success' :
                                      order.orderStatus === 'Shipped' ? 'bg-primary' :
                                        order.orderStatus === 'Processing' ? 'bg-info text-dark' :
                                          order.orderStatus === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                                    }`}>
                                    {order.orderStatus}
                                  </span>
                                </td>
                                <td>{DateFormatter(order.orderDate)}</td>
                              </tr>
                            )
                          })}
                          {/* totals row for this order (spans columns for clarity) */}
                          <tr className="table-secondary">
                            <td colSpan={4} className="text-end fw-semibold">Subtotal:</td>
                            <td>₹{subtotal.toFixed(2)}</td>
                            <td colSpan={3}></td>
                          </tr>
                          <tr className="table-secondary">
                            <td colSpan={4} className="text-end fw-semibold">GST (18%):</td>
                            <td>₹{gst.toFixed(2)}</td>
                            <td colSpan={3}></td>
                          </tr>
                          <tr className="table-secondary">
                            <td colSpan={4} className="text-end fw-semibold">Shipping:</td>
                            <td>₹{shipping.toFixed(2)}</td>
                            <td colSpan={3}></td>
                          </tr>
                          <tr className="table-light">
                            <td colSpan={4} className="text-end fw-bold">Total:</td>
                            <td className="fw-bold text-success">₹{total.toFixed(2)}</td>
                            <td colSpan={3}></td>
                          </tr>
                        </React.Fragment>
                      )
                    }
                    )}
                  </tbody>
                </table>
              )}
            </div>



            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-end mt-4 mb-0">
                <li className="page-item disabled">
                  <a className="page-link">Previous</a>
                </li>
                <li className="page-item active">
                  <a className="page-link bg-primary border-0" href="#">1</a>
                </li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default page
