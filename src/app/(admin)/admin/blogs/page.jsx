"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import api from "@/_utils/api";


const page = () => {
  const [blogData, setBlogData] = useState([])

  const getBlogData = async () => {
    try {
      const reponse = await api.get("/blogs/getAllBlogs")

      if (reponse.data.status === 1) {
        setBlogData(reponse.data.data)
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
        const res = await api.post(`/blogs/deleteBlog`, {
          id: id,
        });

        if (res.data.status === 1) {
          toast.success(res.data.message);
          getBlogData();
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
        const res = await api.post(`/blogs/changeStatus`, {
          id: id,
          status: status
        })
        if (res.data.status === 1) {
          toast.success(res.data.message)
          getBlogData();
        }
      } catch (error) {
        console.log(error)
      }
    }

  }

  useEffect(() => {
    getBlogData();
  }, [])


  return (
    <>
      <div className="container mt-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center my-5">
          <h3 className="fw-bold mb-0 text-light">📘 Blog Management</h3>
          <Link href="/admin/blogs/create" className="btn btn-info add-btn">
            <i className="bi bi-plus-lg me-1"></i> Add Blog
          </Link>
        </div>

        {/* Table */}
        <div className="card bg-white shadow-sm border-0">
          <div className="card-body p-0">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Blog Name</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogData?.map((blog, index) => (
                  <tr key={blog._id}>
                    <td>{index + 1}</td>
                    <td>{blog.blogName}</td>
                    <td>
                      {blog.status === 1 ? (
                        <span
                          className="badge bg-success"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleChangeStatus(blog.status, blog._id)}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          className="badge bg-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleChangeStatus(blog.status, blog._id)}
                        >
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Link
                          href={{
                            pathname: "/admin/blogs/edit",
                            query: { id: blog._id },
                          }}
                          className="btn-edit"
                        >
                          <i className="bi bi-pencil" />
                        </Link>

                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="btn-delete"
                        >
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

        {/* Pagination UI */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <p className="mb-0">Showing 1 to 3 of 3 entries</p>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2">
              Prev
            </button>
            <button className="btn btn-sm btn-outline-primary">Next</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
