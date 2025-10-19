"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DateFormatter from "@/_helper/frontend/DataFormatter";
import api from "@/_utils/api";


const Page = () => {
  const [testimonialData, setTestimonialData] = useState([]);

  const getTestimonailData = async () => {
    try {
      const res = await api.get("/testimonials/getAllTestimonials");
      if (res.data.status === 1) {
        toast.success(res.data.message)
        setTestimonialData(res.data.data);
      }
      else{
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error);      
    }
  };

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
        const res = await api.post("/testimonials/deleteTestimonial", { id });
        if (res.data.status === 1) {
          toast.success(res.data.message)
          getTestimonailData();
        }
          else{
        toast.error(res.data.message)
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
        const res = await api.post("/testimonials/changeStatus", {
          id: id,
          status: status,
        });

        if (res.data.status === 1) {
          toast.success(res.data.message)
          getTestimonailData();
        }
        else{
          toast.error(res.data.error)
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getTestimonailData();
  }, []);

  return (
    <>
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-light">📝 Testimonials</h4>
          <Link href="/admin/testimonials/create" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i> Add Testimonial
          </Link>
        </div>

        <div className="bg-white rounded shadow-sm p-4">
          <table className="table table-bordered table-responsive table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Name</th>
                <th scope="col"> Profession</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonialData.map((testimonial, index) => (
                <tr key={testimonial._id}>
                  <td>{index + 1}</td>
                  <td>{testimonial.fullName}</td>
                  <td>{testimonial.profession}</td>
                  <td>
                    {testimonial.status === 1 ? (
                      <span
                        className="badge bg-success"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleChangeStatus(testimonial.status, testimonial._id)}
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        className="badge bg-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleChangeStatus(testimonial.status, testimonial._id)}
                      >
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>{DateFormatter(testimonial.date)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Link
                        href={{
                          pathname: "/admin/testimonials/edit",
                          query: { id: testimonial._id },
                        }}
                        className="btn-edit"
                      >
                        <i className="bi bi-pencil" />
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
                        className="btn-delete"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonialData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No testimonials found.
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

export default Page;
