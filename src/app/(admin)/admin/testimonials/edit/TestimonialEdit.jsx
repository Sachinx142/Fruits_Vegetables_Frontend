"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/_utils/api";

const TestimonialEdit = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
    const [userImage, setUserImage] = useState(null)
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
  


  const fetchTestimonial = async () => {
    try {
      const res = await api.post("/testimonials/getTestimonialsByID", { id });
      if (res.data.status === 1) {
        const testimonial = res.data.data;
        reset(testimonial);
        setValue("date", testimonial.date.slice(0, 10));
        setRating(testimonial.rating || 0);
        setImagePreview(`${testimonial.userImage}`);
      } else {
        toast.error("Failed to load testimonial");
      }
    } catch (error) {
      toast.error("Error fetching testimonial");
    }
  };


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setUserImage(file);               
    setValue("userImage", file);       
    setImagePreview(URL.createObjectURL(file));
  }
};

  const onSubmit = async (data) => {
       setSubmitted(true);
    if (!userImage  && !imagePreview) {
      toast.error("Please upload an image.");
      return;
    }
 
    
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("fullName", data.fullName);
      formData.append("profession", data.profession);
      formData.append("message", data.message);
      formData.append("rating", rating);
      formData.append("date", data.date);
      formData.append("title", data.title);
      formData.append("keywords", data.keywords);
      formData.append("metaDescription", data.metaDescription);
      formData.append("userImage", userImage);
  
      const res = await api.post("/testimonials/updateTestimonial", formData);

      if (res.data.status === 1) {
        toast.success(res.data.message);
        router.push("/admin/testimonials");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

    useEffect(() => {
    if (id) {
      fetchTestimonial();
    }
  }, [id]);


  return (
    <>
      <div className="container my-5">
        <h4 className="fw-bold mb-4 text-light">✏️ Edit Testimonial</h4>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow-sm">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                {...register("fullName", { required: "Name is required" })}
                className={`form-control ${errors.fullName ? "border-danger" : ""}`}
              />
              {errors.fullName && <small className="text-danger">{errors.fullName.message}</small>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Profession</label>
              <input
                {...register("profession", { required: "Profession is required" })}
                className={`form-control ${errors.profession ? "border-danger" : ""}`}
              />
              {errors.profession && <small className="text-danger">{errors.profession.message}</small>}
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Message</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                rows={4}
                className={`form-control ${errors.message ? "border-danger" : ""}`}
              />
              {errors.message && <small className="text-danger">{errors.message.message}</small>}
            </div>

             <div className="col-md-6">
            <label className="form-label fw-semibold">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-thumbnail"
                  width={100}
                />
              </div>
            )}
          </div>
            
              <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Rating</label>
              <div className="d-flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <label key={val} htmlFor={`star-${val}`}>
                    <i
                      className="fa fa-star"
                      style={{
                        color: rating >= val ? "gold" : "gray",
                        fontSize: "20px",
                      }}
                    ></i>
                    <input
                      type="radio"
                      id={`star-${val}`}
                      name="rating"
                      className="d-none"
                      value={val}
                      onChange={() => setRating(val)}
                    />
                  </label>
                ))}
              </div>
              {submitted && rating === 0 && (
                <small className="text-danger mx-2 my-2">Rating is required</small>
              )}
            </div>


            <div className="col-md-3">
              <label className="form-label fw-semibold">Date</label>
              <input type="date" {...register("date")} className="form-control" />
            </div>
          </div>

          {/* SEO Section */}
          <div className="mt-5 border-top pt-4">
            <h5 className="fw-bold mb-3">🔍 SEO Section</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">SEO Title</label>
                <input {...register("title")} className="form-control" />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Meta Keywords</label>
                <input {...register("keywords")} className="form-control" />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold">Meta Description</label>
                <textarea {...register("metaDescription")} className="form-control" rows={3} />
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button type="submit" className="btn btn-success px-4" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TestimonialEdit;
