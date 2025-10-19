"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams ,useRouter} from "next/navigation";
import api from "@/_utils/api";
import toast from 'react-hot-toast';

const CategoryEdit = () => {
     const searchParams = useSearchParams();
      const id = searchParams.get("id");
        const router = useRouter();
      

  const { register, handleSubmit,reset, formState: { isSubmitting, errors } } = useForm();
 
    const  getCategoryDatabyId = async () => {
    try {
      const res = await api.post("/category/getCategorybyId", { id });
      if (res.data.status === 1) {
        reset(res.data.data)
      }
      else{
        toast.error(res.data.error)
      }
    } catch (error) {
      console.log(error);
    }
  };


  const onSubmit = async (data) => {
    try {
      data.id = id
      const res = await api.post('/category/updateCategory', data)
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

  useEffect(()=>{
    if(id){
        getCategoryDatabyId()
    }
  },[id])

  return (
    <main className="container my-5">
      {/* Title */}
      <header className="mb-4">
        <h1 className="fw-bold text-light">Edit Category</h1>
      </header>

      <section className="bg-white p-4 rounded shadow-sm">
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
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
          <div className="text-end">
          <button type="submit" className="btn btn-success px-4" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CategoryEdit;
