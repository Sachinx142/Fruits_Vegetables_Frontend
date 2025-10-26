"use client"
import DateFormatter from '@/_helper/frontend/DataFormatter'
import api from '@/_utils/api'
import Footer from '@/component/Footer'
import Navbar from '@/component/Navbar'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const page = () => {
  const session = useSession();
  const id = session?.data?.user?.id;
  const [ordersDetails, setOrdersDetails] = useState([]);
  const getallOrders = async () => {
     try {
       const res = await api.post('/order/getOrdersByUserId',{
          userId: id
       })
        if(res.data.status === 1){
          setOrdersDetails(res.data.data);
        }

     } catch (error) {
       console.log(error)
     }
  }

  useEffect(()=>{
    if(id){
        getallOrders();
    }
  },[id])


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
                <input type="text" className="form-control form-control-lg" placeholder="🔍 Search Order ID or Product Name" />
              </div>
              <div className="col-md-4">
                <select className="form-select form-select-lg">
                  <option value="">Filter by Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button className="btn btn-primary btn-lg">Search</button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle text-center">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product Image</th>
                    <th>Product Qunatity</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {ordersDetails.length === 0 ? (
                    <tr>
                      <td colSpan="7">No orders found.</td>
                      </tr>
                      ) : (
                          ordersDetails?.map((order) => (
                            order.products.map((item, index) => (
                              <tr key={index}>
                                <td>{order.orderId}</td>
                                <td>
                                  <img
                                    src={item.productId ? item.productId?.productImage : 'https://via.placeholder.com/50'}
                                    alt={item.productId ? item.productId.productName : 'Product Image'}
                                    width="50"
                                    height="50"
                                  />
                                </td>
                                <td>{item.quantity}</td>
                                <td>${item.productId ? item.productId.finalPrice : '0.00'}</td>
                                <td>{order.paymentStatus}</td>
                                <td>{order.orderStatus}</td>
                                <td>{DateFormatter(order.orderDate)}</td>
                              </tr>
                            ))
                          ))
                      )}
                </tbody>
              </table>
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
