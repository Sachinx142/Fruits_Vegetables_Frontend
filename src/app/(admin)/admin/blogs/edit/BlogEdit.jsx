"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import toast from 'react-hot-toast';
import api from "@/_utils/api";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BlogEdit = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const router = useRouter();
  const editor = useRef(null);

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const [blogDesc, setBlogDesc] = useState("");
  const [blogImage, setBlogImage] = useState();
  const [existedBlogImage, setExistedBlogImage] = useState();

  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Start typing...",
    height: "300px"
  }), []);

  const getBlogDataByID = async () => {
    try {
      const res = await api.post("/blogs/getBlogByID", { id });
      if (res.data.status === 1) {
        const blog = res.data.data;
        reset(blog);
        setBlogDesc(blog.blogDescription);
        setBlogImage(blog.blogImage);
        setExistedBlogImage(blog.blogImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formdata = new FormData();
      formdata.append("blogName", data.blogName);
      formdata.append("blogSlug", data.blogSlug);
      formdata.append("blogImage", blogImage);
      formdata.append("blogContent", data.blogContent);
      formdata.append("blogDate", data.blogDate);
      formdata.append("publisherName", data.publisherName);
      formdata.append("blogDescription", blogDesc);
      formdata.append("title", data.title);
      formdata.append("keywords", data.keywords);
      formdata.append("metaDescription", data.metaDescription);
      formdata.append("id", id);

   

      const res = await api.post("/blogs/updateBlog", formdata);
      if (res.data.status == 1) {
        toast.success(res.data.message);
        router.push("/admin/blogs");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog.");
    }
  };

  useEffect(() => {
    if (id) {
      getBlogDataByID();
    }
  }, [id]);



  return (
    <>
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 text-light">📝 Edit Blog</h4>
          <Link href={`/blogs/${id}`} className="btn btn-outline-dark" target="_blank">
            <i className="bi bi-eye me-1"></i> View Blog
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded shadow-sm bg-white">
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Name</label>
              <input
                type="text"
                {...register("blogName", {
                  required: {
                    value: true,
                    message: "Blog name is required"
                  }
                })}
                className={`form-control ${errors.blogName ? "border-danger" : ""}`}
                placeholder="Enter blog name"
              />
              {errors.blogName && <small className="text-danger">{errors.blogName.message}</small>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Slug</label>
              <input
                {...register("blogSlug", {
                  required: {
                    value: true,
                    message: 'Blog slug is required'
                  }
                })}
                className={`form-control ${errors.blogSlug ? "border-danger" : ""}`}
                placeholder="Enter blog slug"
              />
              {errors.blogSlug && <small className="text-danger">{errors.blogSlug.message}</small>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Date</label>
              <input
                type="date"
                {...register("blogDate", {
                  required: {
                    value: true,
                    message: 'Blog date is required'
                  }
                })}
                className={`form-control ${errors.blogDate ? "border-danger" : ""}`}
              />
              {errors.blogDate && <small className="text-danger">{errors.blogDate.message}</small>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Publisher Name</label>
              <input
                {...register("publisherName", {
                  required: {
                    value: true,
                    message: 'PublisherName is required'
                  }
                })}
                className="form-control"
                placeholder="Enter publisher name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Blog Content</label>
              <textarea
                {...register("blogContent", {
                  required: {
                    value: true,
                    message: 'Blog content is required'
                  }
                })}
                className="form-control"
                rows={3}
                placeholder="Write blog content..."
              />
              {errors.blogContent && <small className="text-danger">{errors.blogContent.message}</small>}
            </div>

            <div className="col-md-6 d-flex">
              <div className="flex-grow-1 me-3">
                <label className="form-label fw-semibold">Blog Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setBlogImage(e.target.files[0])}
                  {...register("blogImage")}
                />
              </div>

        
                <div className="d-flex align-items-center">
                  {blogImage && typeof blogImage !== "string" ? (
                    <img
                      src={URL.createObjectURL(blogImage)}
                      alt="Uploaded"
                      className="img-fluid rounded shadow mt-2"
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  ) : blogImage && typeof blogImage === "string" ? (
                    <img
                      src={blogImage}
                      alt="Existing"
                      className="img-fluid rounded shadow mt-2"
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  ) : (

                    <img
                      src="/assets/img/demo-org.webp"
                      alt="Default"
                      className="img-fluid rounded shadow mt-2"
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  )}
                </div>

              </div>

          </div>

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

          <div className="mt-5 border-top pt-4">
            <h5 className="fw-bold mb-3">🔍 SEO Section</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Title</label>
                <input {...register("title", {
                  required: {
                    value: true,
                    message: 'title is required'
                  }
                })} className="form-control" placeholder="Enter SEO title" />
              </div>

              <div className="col-md-6" />

              <div className="col-md-6">
                <label className="form-label fw-semibold">Keywords</label>
                <textarea {...register("keywords", {
                  value: true,
                  message: 'keywords is required'
                })} className="form-control" rows={2} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Meta Description</label>
                <textarea {...register("metaDescription", {
                  value: true,
                  message: 'metaDescription is required'
                })} className="form-control" rows={2} />
              </div>
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogEdit;
