"use client";
import api from "@/_utils/api";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from 'react-hot-toast';


const page = () => {
  const [productData,setProductData] = useState([]);
  


  const getProuductData = async () => {
      try {
         const res = await api.get('/product/getAllProducts')
         if(res.data.status === 1 ) {
             setProductData(res.data.data);
         }
      } catch (error) {
          console.log(error)
      }
  }

  


  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the testimonial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post("/product/deleteProduct", { id });
        if (response.data.status === 1) {
          toast.success(response.data.message);
          getProuductData()
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChangeStatus = async (status, id) => {
    const result = await Swal.fire({
      title: "Change Status?",
      text: `Do you want to ${status === 1 ? "deactivate" : "activate"} this testimonial?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `${status === 1 ? "Deactivate" : "Activate"}`,
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post("/product/changeStatus", {
          id: id,
          status: status,
        });

        if (response.data.status === 1) {
          toast.success(response.data.message);
          getProuductData()
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(()=>{
    getProuductData()
  },[])
 
  

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-light">📦 Product List</h4>
        <Link href="/admin/products/create" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Add Product
        </Link>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
                <th scope="col">Sr. No.</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productData?.map((product,index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product?.productName}</td>
                <td>₹{product?.finalPrice}</td>
                <td>{product?.stock}</td>
                <td>
                  {product.status === 1 ? (
                       <span
                        className="badge bg-success"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleChangeStatus(product.status, product._id)}
                      >
                        Active
                      </span>
                  ):(
                       <span
                        className="badge bg-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleChangeStatus(product.status, product._id)}
                      >
                        Inactive
                      </span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                   <Link
                        href={{
                          pathname: "/admin/products/edit",
                          query: { id: product._id },
                        }}
                        className="btn-edit"
                      >
                        <i className="bi bi-pencil" />
                      </Link>
                    <button onClick={()=>handleDelete(product._id)} className="btn-delete">
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
