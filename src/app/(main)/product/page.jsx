'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import api from '@/_utils/api';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';



const page = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [testimonialsData, setTestimonialsData] = useState([]);



  const getallLatestProducts = async () => {
    try {
      const res = await api.get("/product/getAllActiveProducts");
      if (res.data.status === 1) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getallTestimonials = async () => {
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
    getallLatestProducts();
    getallTestimonials();
  }, [])

  return (
    <>
      <Navbar />
      <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Products</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a className="text-body" href="#">Home</a></li>
              <li className="breadcrumb-item"><a className="text-body" href="#">Pages</a></li>
              <li className="breadcrumb-item text-dark active" aria-current="page">Products</li>
            </ol>
          </nav>
        </div>
      </div>



      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div
                className="section-header text-start mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ maxWidth: "500px" }}
              >
                <h1 className="display-5 mb-3">Our Products</h1>
                <p>
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed rebum vero dolor duo.
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 text-start text-lg-end wow slideInRight"
              data-wow-delay="0.1s"
            >
              <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                <li className="nav-item me-2">
                  <Link
                    className="btn btn-outline-primary border-2 active"
                    data-bs-toggle="pill"
                    href="#tab-1"
                  >
                    Vegetable
                  </Link>
                </li>
                <li className="nav-item me-2">
                  <Link
                    className="btn btn-outline-primary border-2"
                    data-bs-toggle="pill"
                    href="#tab-2"
                  >
                    Fruits{" "}
                  </Link>
                </li>
                <li className="nav-item me-0">
                  <Link
                    className="btn btn-outline-primary border-2"
                    data-bs-toggle="pill"
                    href="#tab-3"
                  >
                    Fresh
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <div className="row g-4">
                {products && products.length > 0 ? (
                  products?.map((ele, ind) => (
                    <div key={ind} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 rounded-4 overflow-hidden product-card">
                        {/* Product Image Container */}
                        <div
                          className="position-relative overflow-hidden"
                          style={{ height: "220px" }}
                        >
                          <Link href={`/product/${ele?.productSlug}`}>
                            <img
                              src={ele?.productImage || "img/product-1.jpg"}
                              className="card-img-top h-100 w-100"
                              alt={ele?.productName}
                              style={{
                                objectFit: "cover",
                                transition: "transform 0.3s",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.transform = "scale(1.1)")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />
                          </Link>

                          {/* Wishlist Icon */}
                          <button
                            className="btn btn-light rounded-circle position-absolute"
                            onClick={() => toggleWishlist(ele._id)}
                            style={{
                              top: "10px",
                              right: "10px",
                              zIndex: 5,
                              width: "38px",
                              height: "38px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                            }}
                            title={
                              wishlist.includes(ele._id)
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                          >
                            {wishlist.includes(ele._id) ? (
                              <FaHeart className="text-danger" size={18} />
                            ) : (
                              <FaRegHeart className="text-dark" size={18} />
                            )}
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="card-body text-center">
                          <h5 className="card-title text-truncate">
                            <Link
                              href={`/product/${ele?.productSlug}`}
                              className="text-dark text-decoration-none"
                            >
                              {ele?.productName}
                            </Link>
                          </h5>
                          <p
                            className="card-text text-muted small"
                            dangerouslySetInnerHTML={{
                              __html: ele?.description?.slice(0, 50),
                            }}
                          ></p>
                          <div className="mb-3">
                            <span className="text-primary fw-bold me-2">
                              ₹{ele?.finalPrice}
                            </span>
                            {ele?.discountedPrice > 0 && (
                              <span className="text-muted text-decoration-line-through">
                                ₹{ele?.actualPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="d-flex border-top">
                          <Link
                            href={`/product/${ele?.productSlug}`}
                            className="flex-fill text-center py-2 border-end text-decoration-none text-dark hover-bg-light"
                          >
                            <i className="fa fa-eye text-primary me-1"></i>View
                          </Link>
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
                      style={{ maxWidth: "600px" }}
                    />
                  </div>
                )}

                {/* Browse More Button */}
                <div
                  className="col-12 text-center wow fadeInUp"
                  data-wow-delay="0.1s"
                >
                  <Link
                    className="btn btn-primary rounded-pill py-3 px-5"
                    href=""
                  >
                    Browse More Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* <!-- Firm Visit Start --> */}
      <div className="container-fluid bg-primary bg-icon mt-5 py-6">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-7 wow fadeIn" data-wow-delay="0.1s">
              <h1 className="display-5 text-white mb-3">Visit Our Firm</h1>
              <p className="text-white mb-0">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.</p>
            </div>
            <div className="col-md-5 text-md-end wow fadeIn" data-wow-delay="0.5s">
              <a className="btn btn-lg btn-secondary rounded-pill py-3 px-5" href="">Visit Now</a>
            </div>
          </div>
        </div>
      </div>


      {/* <!-- Testimonial Start --> */}
      <div className="container-fluid bg-light bg-icon py-6 mb-5">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Customer Review</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>

          {testimonialsData && testimonialsData.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
              className="testimonial-swiper"
            >
              {testimonialsData?.map((ele, ind) => (
                <SwiperSlide key={ind}>
                  <div className="testimonial-item position-relative bg-white p-5 m-3 h-100 rounded shadow-sm">
                    <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5"></i>
                    <p className="mb-4">{ele?.message}</p>
                    <div className="d-flex align-items-center">
                      <img
                        className="flex-shrink-0 rounded-circle"
                        src={ele?.userImage || "/img/testimonial-1.jpg"}
                        alt={ele?.fullName}
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                      <div className="ms-3">
                        <h5 className="mb-1">{ele?.fullName}</h5>
                        <span>{ele?.profession}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center">No testimonials found.</p>
          )}
        </div>
      </div>

      <Footer />

    </>
  )
}

export default page
