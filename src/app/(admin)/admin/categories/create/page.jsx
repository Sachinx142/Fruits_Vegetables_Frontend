"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/_utils/api";
import toast from 'react-hot-toast';

const page = () => {
  const router = useRouter()
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/category/createCategory', data)
      if (res.data.status === 1) {
        toast.success(res.data.message)
        router.push('/admin/categories')
      }
      else {
        toast.error(res.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className="container my-5">
      {/* Title */}
      <header className="mb-4">
        <h1 className="fw-bold text-light">➕ Add New Category</h1>
      </header>

      <section className="bg-white p-4 rounded shadow-sm">
        <form>
          <div className="row">
            {/* Basic Info */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Name</label>
              <input
                type="text"
                className={`form-control w-50 ${errors.categoryName ? 'is-invalid' : ''}`}
                placeholder="e.g. Fruits, Vegetables"
                {...register("categoryName", {
                  required: {
                    value: true,
                    message: 'Category Name is required'
                  }
                })}
              />
              {errors.categoryName && <span className="text-danger">{errors.categoryName.message}</span>}
            </div>
          </div>
          {/* Submit */}
          <div className="text-end">
            <button type="submit" className="btn btn-success px-4" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default page;
