"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import api from "@/_utils/api";

const Page = () => {
  const router = useRouter()

  const [roles, setRoles] = useState([]);

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


    const fetchRoles = async () => {
      try {
        const res = await api.get("/roles/getAllRoles");
        if (res.data.status === 1) {
          setRoles(res.data.data);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to load roles");
      }
    };


    useEffect(()=>{
      fetchRoles()
    },[])


  const onSubmit  = async (data) => {

    try {
      const res = await api.post("/staff/createStaff  ", data);

      if (res.data.status === 1) {
        toast.success(res.data.message);
        reset()
        router.push('/admin/staff')
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
           <ToastContainer />
      <div className="container my-5">
        <h4 className="fw-bold mb-4 text-light">➕ Create Staff</h4>

        <div className="bg-white p-4 rounded shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Kumar"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <small className="text-danger">Name is required</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. rahul@example.com"
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                />
                {errors.email && (
                  <small className="text-danger">Valid email is required</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  {...register("roleId", { required: true })}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <small className="text-danger">Role is required</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Password"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <small className="text-danger">Password is required</small>
                )}
              </div>
            </div>

            <div className="text-end mt-3">
              <button type="submit" className="btn btn-success px-4">
                💾 Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
