"use client";

import api from "@/_utils/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);

  const getAllTestimonials = async () => {
    try {
      const res = await api.get("/testimonials/getLatestTestimonials");
      if (res.data.status === 1) {
        setTestimonialsData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTestimonials();
  }, []);

  return (
    <>
      {/* Page Header Start */}
      <div className="container-fluid page-header wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Testimonial</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link className="text-body" href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <span className="text-body">Pages</span>
              </li>
              <li className="breadcrumb-item text-dark active" aria-current="page">
                Testimonial
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Testimonial Start */}
      <div className="container-fluid bg-light bg-icon py-6">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Customer Review</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed
              rebum vero dolor duo.
            </p>
          </div>

          <div className="row g-4">
            {testimonialsData.length > 0 ? (
              testimonialsData.map((testimonial, index) => (
                <div
                  key={index}
                  className="col-lg-6 col-xl-3 testimonial-item position-relative bg-white p-5 mt-4 wow fadeInUp"
                  data-wow-delay={`0.${index + 1}s`}
                >
                  <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5" />
                  <p className="mb-4">{testimonial?.message}</p>
                  <div className="d-flex align-items-center">
                    <img
                      className="flex-shrink-0 rounded-circle"
                      width={80}
                      height={80}
                      src={testimonial.userImage}
                      alt={testimonial.fullName}
                    />
                    <div className="ms-3">
                      <h5 className="mb-1">{testimonial.fullName}</h5>
                      <span>{testimonial.profession}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
              <img
                src="/img/no-data.png"
                alt="no-data-image"
                className="img-fluid"
                width={600}
                height={400}
                style={{ maxWidth: "600px" }}
              />
            </div>
            )}
          </div>
        </div>
      </div>
      {/* Testimonial End */}
    </>
  );
};

export default Page;
