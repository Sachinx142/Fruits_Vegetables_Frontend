"use client";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <>
      <Navbar />

      {/* Page Header Start */}
      <div className="container-fluid page-header wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Features</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link className="text-body" href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link className="text-body" href="#">Pages</Link>
              </li>
              <li className="breadcrumb-item text-dark active" aria-current="page">
                Features
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}

      {/* Feature Start */}
      <div className="container-fluid bg-light bg-icon my-5 py-6">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Our Features</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed
              rebum vero dolor duo.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature Box 1 */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  src="/img/icon-1.png"
                  alt="Natural Process"
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <h4 className="mb-3">Natural Process</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed
                  vero dolor duo.
                </p>
                <Link
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="#"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Feature Box 2 */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  src="/img/icon-2.png"
                  alt="Organic Products"
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <h4 className="mb-3">Organic Products</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed
                  vero dolor duo.
                </p>
                <Link
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="#"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Feature Box 3 */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  src="/img/icon-3.png"
                  alt="Biologically Safe"
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <h4 className="mb-3">Biologically Safe</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed
                  vero dolor duo.
                </p>
                <Link
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="#"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Feature End */}

      <Footer />
    </>
  );
};

export default Page;
