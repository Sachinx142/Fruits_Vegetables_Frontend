"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const EditStaff = () => {
  const [roles, setRoles] = useState([]);
  const router = useRouter();
  const { id } = useParams(); 

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();


  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/roles/getAllRoles");
      if (res.data.status === 1) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    }
  };


  const fetchStaff = async () => {
    try {
      const res = await axios.post("/api/admin/getStaffById", { id });
      if (res.data.status === 1) {
        reset(res.data.data); // 
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch staff");
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchRoles();
    if (id) fetchStaff();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/admin/updateStaff", {
        ...data,
        id, 
      });

      if (res.data.status === 1) {
        toast.success(res.data.message);
        reset();
        router.push("/admin/staff");
      } else {
        toast.error(res.data.message || "Failed to update staff");
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
        <h4 className="fw-bold mb-4 text-light">✏️ Edit Staff</h4>

        <div className="bg-white p-4 rounded shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Kumar"  
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. rahul@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  {...register("roleId", { required: "Role is required" })}
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <small className="text-danger">{errors.roleId.message}</small>
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


            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success px-4">
                💾 Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditStaff;
