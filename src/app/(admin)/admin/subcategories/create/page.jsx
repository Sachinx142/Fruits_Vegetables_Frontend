"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/_utils/api";
import toast from 'react-hot-toast';

const page = () => {
  const router = useRouter()
  const [categoryData, setCategoryData] = useState([]);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();


  const onSubmit = async (data) => {
    try {
      const res = await api.post('/subcategory/createSubCategory', data)
      if (res.data.status == 1) {
        toast.success(res.data.message)
        router.push('/admin/subcategories')
      }
      else {
        toast.error(res.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }


  const getActivCategory = async () => {
    try {
      const res = await api.get("/category/getAllActiveCategory");

      if (res.data.status ==  1) {
        setCategoryData(res.data.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getActivCategory()
  }, [])



  return (
    <main className="container my-5">
      {/* Title */}
      <header className="mb-4">
        <h1 className="fw-bold text-light">➕ Add New SubCategory</h1>
      </header>

      <section className="bg-white p-4 rounded shadow-sm">
        <form>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label htmlFor="example-select" className="form-label">Category</label>
                <select id="example-select" className={`form-select ${errors.categoryId ? "border-danger" : ""}`} {...register("categoryId", {
                  required: {
                    value: true,
                    message: "Category is required!"
                  }
                })}>
                  <option defaultChecked hidden value={""}>Select Category</option>
                  {
                    categoryData?.map((ele, ind) =>
                      <option value={ele._id} key={ind}>{ele.categoryName}</option>)
                  }
                </select>
                {
                  errors.categoryId && <span className="help-block text-danger"><small>{errors.categoryId.message}</small></span>
                }
              </div>
            </div>


            <div className="col-md-6">

              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">Sub Category</label>
                <input
                  {...register("subCategoryName",
                    { required: {
                        value:true,
                        message:'Subcategory Name is required*'
                    } }
                  )}
                  type="text"
                   id="simpleinput"
                   className={`form-control ${errors.subCategoryName ? "border-danger" : ""}`}
                  placeholder='Enter Sub Category name' />
                {
                  errors.subCategoryName && <span className="help-block text-danger"><small>{errors.subCategoryName.message}</small></span>
                }
              </div>

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
