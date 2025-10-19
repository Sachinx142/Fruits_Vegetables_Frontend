"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import api from "@/_utils/api";
import { DataTable } from 'simple-datatables'
import "simple-datatables/dist/style.css"; 

const page = () => {
  const [categoryData, setCategoryData] = useState()

  const getCategoryData = async () => {
    try {
      const reponse = await api.get("/category/getCategory")

      if (reponse.data.status === 1) {
        setCategoryData(reponse.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

   //Custom Pagination 
  const [pagiStartInd, setPagiStartInd] = useState(0);
  const [pagiEndInd, setPagiEndInd] = useState(9);
  const [currentPageNum, setCurrentPageNum] = useState(1)
  const [totalPageNum, setTotalPageNum] = useState()
  
  const handlePaginationNext = (e) => {
      e.preventDefault();
      if(pagiEndInd < categoryData?.length - 1){
        setPagiStartInd((prev)=>prev + 10);
        setPagiEndInd((prev)=>prev + 10);
        setCurrentPageNum(currentPageNum + 1)
      }
  }

  const handlePaginationPrev = (e) => {
    e.preventDefault();
    if (pagiStartInd > 0) {
      setPagiStartInd((prev) => prev + 10);
      setPagiEndInd((prev) => prev + 10);
      setCurrentPageNum(currentPageNum - 1)
    }
  }

    useEffect(() => {
        if (categoryData) {
            new DataTable("#myTable", {
                paging: false
            });
        }
    }, [categoryData]);


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the blog permanently.",
      icon: "warning",
      background: "#f9fafb",
      color: "#111827",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.post(`/category/deleteCategory`, {
          id: id,
        });

        if (res.data.status === 1) {
          toast.success(res.data.message);
          getCategoryData();
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
      }
    }
  };

  const handleChangeStatus = async (status, id) => {
    const result = await Swal.fire({
      title: "Change Status?",
      text: `Do you want to ${status === 1 ? "deactivate" : "activate"} this blog?`,
      icon: "question",
      background: "#f9fafb",
      color: "#111827",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `${status === 1 ? "Deactivate" : "Activate"}`,
      cancelButtonText: "Cancel",
    });


    if (result.isConfirmed) {
      try {
        const res = await api.post(`/category/changeStatus`, {
          id: id,
          status: status
        })
        if (res.data.status === 1) {
          toast.success(res.data.message)
          getCategoryData();
        }
      } catch (error) {
        console.log(error)
      }
    }

  }

  useEffect(() => {
    getCategoryData();
  }, [])



  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-light">📂 Category List</h4>
        <Link href="/admin/categories/create" className="btn btn-primary">
          ➕ Create Category
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="table-responsive">
          <table id="myTable"  className="table table-bordered table-hover">
          <thead>
            <tr className="text-dark">
              <th>Category</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryData?.map((ele, ind) => (
              <tr key={ind}>
                <td>{ele.categoryName}</td>
                <td className="text-center">
                  {ele.status === 1 ? (
                    <span
                      className="badge bg-success"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleChangeStatus(ele.status, ele._id)}
                    >
                      Active
                    </span>
                  ) : (
                    <span
                      className="badge bg-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleChangeStatus(ele.status, ele._id)}
                    >
                      Inactive
                    </span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <Link
                      href={{
                        pathname: "/admin/categories/edit",
                        query: { id: ele._id },
                      }}
                      className="btn-edit"
                    >
                      <i className="bi bi-pencil" />
                    </Link>

                    <button
                      onClick={() => handleDelete(ele._id)}
                      className="btn-delete"
                    >
                      <i className="bi bi-trash" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
            {categoryData?.length > 10 &&
              <div className='d-flex gap-2 justify-content-between'>
                <div>
                  <p>Showing {currentPageNum} to {parseInt(totalPageNum, 10)} of {parseInt(totalPageNum, 10)} entries
                  </p>
                </div>
                <div>
                  <a href='#' className='btn btn-primary btn-outline px-4 btn-sm' onClick={(e) => handlePaginationPrev(e)}>Prev</a>
                  <a href='#' className='btn btn-primary  px-4 btn-sm ms-2' onClick={(e) => handlePaginationNext(e)}>Next</a>
                </div>
              </div>
            }
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default page;
