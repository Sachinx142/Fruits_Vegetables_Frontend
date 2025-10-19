"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import api from "@/_utils/api";

const page = () => {
  const router = useRouter()
  const [rating, setRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [userImage, setUserImage] = useState(null)
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const fileValidator = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP allowed.");
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max file size is 2MB");
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (fileValidator(file)) {
      setUserImage(file)
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const ouSubmit = async (data) => {
    setSubmitted(true);
    if (!userImage) {
      toast.error("Please upload an image.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("profession", data.profession);
      formData.append("message", data.message);
      formData.append("rating", rating);
      formData.append("date", data.date);
      formData.append("userImage", userImage);
      formData.append("title", data.title || "");
      formData.append("keywords", data.keywords || "");
      formData.append("metaDescription", data.metaDescription || "");

      const response = await api.post('/testimonials/createTestimonial', formData);

      if (response.data.status === 1) {
        toast.success(response.data.message);
        router.push('/admin/testimonials');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the testimonial.");
    }
  };


  return (
    <>
      <div className="container my-5">
        <h4 className="fw-bold mb-4 text-light">➕ Add Testimonial</h4>

        <div className="bg-white p-4 rounded shadow-sm">
          <form onSubmit={handleSubmit(ouSubmit)}>
            <div className="row">
              {/* Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Jane Doe"
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: 'Full name is required'
                    }
                  })}
                />
                {errors.fullName && <small className="text-danger mx-2 my-2">{errors.fullName.message}</small>}
              </div>

              {/* Profession */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Profession</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dietician"
                  {...register("profession", {
                    required: {
                      value: true,
                      message: 'Profession is required'
                    }
                  })}
                />
                {errors.profession && <small className="text-danger mx-2 my-2">{errors.profession.message}</small>}
              </div>

              {/* Message */}
              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Testimonial message..."
                  {...register("message", {
                    required: {
                      value: true,
                      message: 'Message is required'
                    }
                  })}
                ></textarea>
                {errors.message && <small className="text-danger mx-2 my-2">{errors.message.message}</small>}
              </div>

              {/* Upload Image */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Upload Image</label>
                <input type="file" accept="image/*" className="form-control"
                  {...register("userImage",
                    {
                      required: {
                        value: true,
                        message: "User Image is required*"
                      },
                      onChange: (e) => {
                        handleImageChange(e);
                      }
                    },

                  )}
                />
                {errors.userImage && <small className="text-danger mx-2 my-2">{errors.userImage.message}</small>}
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="img-thumbnail" width={100} />
                  </div>
                )}
              </div>


              {/* Date */}
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Date</label>
                <input
                  type="date"
                  className="form-control"
                  {...register("date", {
                    required: {
                      value: true,
                      message: 'Date is required'
                    }
                  })}
                />
                {errors.date && <small className="text-danger mx-2 my-2">{errors.date.message}</small>}
              </div>
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


            <div className="border-top pt-4 mt-4">
              <h5 className="fw-bold mb-3">🔍 SEO Details</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">SEO Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Testimonial from Jane"
                    {...register("title", {
                      required: {
                        value: true,
                        message: 'SEO Title is required'
                      }
                    })}
                  />
                  {errors.title && <small className="text-danger mx-2 my-2">{errors.title.message}</small>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Meta Keywords</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. testimonial, diet, review"
                    {...register("keywords", {
                      required: {
                        value: true,
                        message: 'Meta Keywords is required'
                      }
                    })}
                  />
                  {errors.keywords && <small className="text-danger mx-2 my-2">{errors.keywords.message}</small>}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">Meta Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write a short description..."
                    {...register("metaDescription", {
                      required: {
                        value: true,
                        message: 'Meta Description is required'
                      }
                    })}
                  ></textarea>
                  {errors.metaDescription && <small className="text-danger mx-2 my-2">{errors.metaDescription.message}</small>}
                </div>
              </div>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success px-4" disabled={isSubmitting}>
                💾  {isSubmitting ? "Saving" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
