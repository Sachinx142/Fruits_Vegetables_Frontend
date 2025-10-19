"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import api from "@/_utils/api";

const page = () => {
  const [subCategoryData, setSubCategoryData] = useState([])

  const getCategoryData = async () => {
    try {
      const reponse = await api.get("/subcategory/getSubCategory")

      if (reponse.data.status === 1) {
        setSubCategoryData(reponse.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }


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
        const res = await api.post(`/subcategory/deleteSubCategory`, {
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
        const res = await api.post(`/subcategory/changeStatus`, {
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
        <h4 className="fw-bold text-light">📂 SubCategory List</h4>
        <Link href="/admin/subcategories/create" className="btn btn-primary">
          ➕ Create SubCategory
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow-sm">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Category</th>
               <th>Sub Category</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategoryData?.map((ele, ind) => (
              <tr key={ind}>
                <td>{ele?.categoryId?.categoryName}</td>
                  <td>{ele.subCategoryName}</td>

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
                        pathname: "/admin/subcategories/edit",
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
            {subCategoryData.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;
