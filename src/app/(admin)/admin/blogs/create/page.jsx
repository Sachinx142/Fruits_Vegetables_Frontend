"use client";
import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/_utils/api";
import toast from 'react-hot-toast';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Page = () => {
  const router = useRouter();
  const editor = useRef(null);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();
  const [blogDesc, setBlogDesc] = useState('');
  const [blogImage, setBlogImage] = useState(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing...',
    height: "300px"
  }), []);

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
      setBlogImage(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!blogDesc || blogDesc.trim() === "") {
        toast.error("Blog description is required");
        return;
      }

      const formData = new FormData();
      formData.append("blogName", data.blogName);
      formData.append("blogSlug", data.blogSlug);
      formData.append("blogContent", data.blogContent);
      formData.append("blogDate", data.blogDate);
      formData.append("publisherName", data.publisherName);
      formData.append("blogDescription", blogDesc);
      formData.append("blogImage", blogImage);
      formData.append("title", data.title);
      formData.append("keywords", data.keywords);
      formData.append("metaDescription", data.metaDescription);

      const res = await api.post('/blogs/createBlog', formData);


      if (res.data.status === 1) {
        toast.success(res.data.message);
        router.push('/admin/blogs');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the blog.");
    }
  };

  return (
    <>
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 text-light">📝 Create New Blog</h4>
          <button className="btn btn-outline-dark">
            <i className="bi bi-eye me-1"></i> View Blog
          </button>
        </div>

        <form className="p-4 rounded shadow-sm bg-white">
          <div className="row g-4">
            {/* Blog Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter blog name"
                {...register("blogName", {
                  required: {
                    value: true,
                    message: "Blog name is required"
                  }
                })}
              />
              {errors.blogName && <small className="text-danger">{errors.blogName.message}</small>}
            </div>

            {/* Blog Slug */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Slug</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter blog slug"
                {...register("blogSlug", {
                  required: {
                    value: true,
                    message: 'Blog slug is required'
                  }
                })}
              />
              {errors.blogSlug && <small className="text-danger">{errors.blogSlug.message}</small>}
            </div>

            {/* Blog Date */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Date</label>
              <input
                type="date"
                className="form-control"
                {...register("blogDate", {
                  required: {
                    value: true,
                    message: 'Blog date is required'
                  }
                })}
              />
              {errors.blogDate && <small className="text-danger">{errors.blogDate.message}</small>}
            </div>

            {/* Publisher Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Publisher Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter publisher name"
                {...register("publisherName", {
                  required: {
                    value: true,
                    message: 'Publisher name is required'
                  }
                })}
              />
              {errors.publisherName && <small className="text-danger">{errors.publisherName.message}</small>}
            </div>

            {/* Blog Content */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Content</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Write blog content..."
                {...register("blogContent", {
                  required: {
                    value: true,
                    message: 'Blog content is required'
                  }
                })}
              />
              {errors.blogContent && <small className="text-danger">{errors.blogContent.message}</small>}
            </div>

            {/* Blog Image & Preview */}
            <div className="col-md-6 d-flex">
              <div className="flex-grow-1 me-3">
                <label className="form-label fw-semibold">Blog Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  {...register("blogImage",
                    {
                      required: {
                        value: true,
                        message: "Blog Image is required*"
                      },
                      onChange: (e) => {
                        handleImageChange(e);
                      }
                    },

                  )}
                />
              {errors.blogImage && <small className="text-danger">{errors.blogImage.message}</small>}
              </div>

              <div className="d-flex align-items-center">
                {blogImage && (
                  <img
                    src={URL.createObjectURL(blogImage)}
                    alt="Preview"
                    width="100"
                    height="100"
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Blog Description */}
          <div className="mt-4">
            <label className="form-label fw-semibold">Blog Description</label>
            <JoditEditor
              ref={editor}
              value={blogDesc}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setBlogDesc(newContent)}
            />
          </div>

          {/* SEO Section */}
          <div className="mt-5 border-top pt-4">
            <h5 className="fw-bold mb-3">🔍 SEO Section</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SEO title"
                  {...register("title", { required: "SEO title is required" })}
                />
                {errors.title && <small className="text-danger">{errors.title.message}</small>}
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Keywords</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="e.g. organic, fruits, health"
                    {...register("keywords", { required: "Keywords are required" })}
                  />
                  {errors.keywords && <small className="text-danger">{errors.keywords.message}</small>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Meta Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Meta description"
                    {...register("metaDescription", { required: "Meta description is required" })}
                  />
                  {errors.metaDescription && <small className="text-danger">{errors.metaDescription.message}</small>}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-primary px-4" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
