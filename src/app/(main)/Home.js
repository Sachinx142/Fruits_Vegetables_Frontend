"use client";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import Link from "next/link";
import api from "@/_utils/api";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



export default function Home() {
  const router = useRouter();
  const session = useSession();
  const role = session?.data?.user?.role;
  const id = session?.data?.user?.id;

  const [blogsData, setBlogsData] = useState([]);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [products, setProducts] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = async (productId) => {
     const token = localStorage.getItem("token");

  if (!id || !token) {
    toast.error("Please login first!");
    return;
  }

    const isWishlisted = wishlist.includes(productId);

    try {
      if (isWishlisted) {
        const res = await api.post("/wishlist/deleteWishlist", {
          user: id,
          product: productId,
        });
        if (res.data.status === 1) {
          setWishlist((prev) => prev.filter((pid) => pid !== productId));
          toast.success(res.data.message);
        }
      } else {
        const res = await api.post("/wishlist/saveWishlist", {
          user: id,
          product: productId,
        });
        if (res.data.status === 1) {
          setWishlist((prev) => [...prev, productId]);
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Something went wrong while updating wishlist");
    }
  };

  const getUserWishlist = useCallback(async () => {
     const token = localStorage.getItem("token");
       if (!id || !token) {
    setWishlist([]); 
    return;
  }
    try {
      const res = await api.post(
        "/wishlist/getAllWishlists",
        { user: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.status === 1) {
        setWishlist(res.data.data.map((item) => item.product._id));
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      setWishlist([]); 
    }
  }, [id]);

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

  const getallBlogs = async () => {
    try {
      const res = await api.get("/blogs/getLatestBlogs");
      if (res.data.status === 1) {
        setBlogsData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
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
    if (role == "user") {
      router.replace("/signup");
    }
  }, [role, router]);

  useEffect(() => {
      getUserWishlist();
  }, [id, getUserWishlist]);

  useEffect(() => {
    getallBlogs();
    getallTestimonials();
    getallLatestProducts();
  }, []);

  return (
    <>
      <Navbar />
      {/* <!-- Carousel Start --> */}
      <div className="container-fluid p-0 mb-5">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div
              className="position-relative w-100"
              style={{ height: "500px" }}
            >
              <img
                src="/img/carousel-1.jpg"
                alt="Slide 1"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
              {/* Caption with black transparent background */}
              <div className="position-absolute top-50 start-0 translate-middle-y ps-5">
                <div className="col-lg-7 p-4">
                  <h1 className="display-2 text-dark mb-4">
                    Organic Food Is Good For Health
                  </h1>
                  <Link
                    href="#"
                    className="btn btn-primary rounded-pill py-sm-3 px-sm-5 me-3"
                  >
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="btn btn-secondary rounded-pill py-sm-3 px-sm-5"
                  >
                    Services
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div
              className="position-relative w-100"
              style={{ height: "500px" }}
            >
              <img
                src="/img/carousel-2.jpg"
                alt="Slide 2"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
              <div className="position-absolute top-50 start-0 translate-middle-y ps-5">
                <div className="col-lg-7 p-4">
                  <h1 className="display-2 text-dark mb-4">
                    Natural Food Is Always Healthy
                  </h1>
                  <Link
                    href="#"
                    className="btn btn-primary rounded-pill py-sm-3 px-sm-5 me-3"
                  >
                    Products
                  </Link>
                  <Link
                    href="#"
                    className="btn btn-secondary rounded-pill py-sm-3 px-sm-5"
                  >
                    Services
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

  
      {/* <!-- About Start --> */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="about-img position-relative overflow-hidden p-5 pe-0">
                <img 
                  className="img-fluid w-100" 
                  src="/img/about.jpg" 
                  alt="About us"
                  width={500}
                  height={400}
                />
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <h1 className="display-5 mb-4">
                Best Organic Fruits And Vegetables
              </h1>
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                sed stet lorem sit clita duo justo magna dolore erat amet
              </p>
              <p>
                <i className="fa fa-check text-primary me-3"></i>Tempor erat
                elitr rebum at clita
              </p>
              <p>
                <i className="fa fa-check text-primary me-3"></i>Aliqu diam amet
                diam et eos
              </p>
              <p>
                <i className="fa fa-check text-primary me-3"></i>Clita duo justo
                magna dolore erat amet
              </p>
              <Link
                className="btn btn-primary rounded-pill py-3 px-5 mt-3"
                href=""
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Feature Start --> */}
      <div className="container-fluid bg-light bg-icon my-5 py-6">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Our Features</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img 
                  className="img-fluid mb-4" 
                  src="/img/icon-1.png" 
                  alt="Natural Process Icon"
                  width={64}
                  height={64}
                />
                <h4 className="mb-3">Natural Process</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed vero dolor duo.
                </p>
                <Link
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href=""
                >
                  Read More
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img 
                  className="img-fluid mb-4" 
                  src="/img/icon-2.png" 
                  alt="Organic Products Icon"
                  width={64}
                  height={64}
                />
                <h4 className="mb-3">Organic Products</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed vero dolor duo.
                </p>
                <Link
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href=""
                >
                  Read More
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img 
                  className="img-fluid mb-4" 
                  src="/img/icon-3.png" 
                  alt="Biologically Safe Icon"
                  width={64}
                  height={64}
                />
                <h4 className="mb-3">Biologically Safe</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed vero dolor duo.
                </p>
                <Link
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href=""
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Product Start --> */}
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
                        <div
                          className="position-relative overflow-hidden"
                          style={{ height: "220px" }}
                        >
                          <Link
                            href={`/product/${ele?.productSlug}`}
                            className="me-3"
                          >
                            <img
                              src={ele?.productImage || "/img/product-1.jpg"}
                              className="card-img-top h-100 w-100"
                              alt={ele?.productName || "Product"}
                              width={300}
                              height={220}
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
                      width={600}
                      height={400}
                      style={{ maxWidth: "600px" }}
                    />
                  </div>
                )}            
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
              <p className="text-white mb-0">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                sed stet lorem sit clita duo justo magna dolore erat amet. Diam
                dolor diam ipsum sit. Aliqu diam amet diam et eos.
              </p>
            </div>
            <div
              className="col-md-5 text-md-end wow fadeIn"
              data-wow-delay="0.5s"
            >
              <Link
                className="btn btn-lg btn-secondary rounded-pill py-3 px-5"
                href=""
              >
                Visit Now
              </Link>
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
              {testimonialsData.map((ele, ind) => (
                <SwiperSlide key={ind}>
                  <div className="testimonial-item position-relative bg-white p-5 m-3 h-100 rounded shadow-sm">
                    <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5"></i>
                    <p className="mb-4">{ele?.message}</p>
                    <div className="d-flex align-items-center">
                      <img
                        className="flex-shrink-0 rounded-circle"
                        src={ele?.userImage || "/img/testimonial-1.jpg"}
                        alt={ele?.fullName || "User"}
                        width={60}
                        height={60}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
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

      {/* <!-- Blog Start --> */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Latest Blog</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>

          <div className="row g-4">
            {blogsData && blogsData.length > 0 ? (
              blogsData.map((ele, ind) => (
                <div
                  key={ind}
                  className="col-lg-4 col-md-6 d-flex align-items-stretch"
                >
                  <div className="blog-card card shadow-sm rounded-4 overflow-hidden w-100">
                    <img
                      className="card-img-top"
                      src={ele?.blogImage || "/img/blog-1.jpg"}
                      alt={ele?.blogName || "Blog Image"}
                      width={400}
                      height={250}
                      style={{
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column">
                      <Link
                        className="d-block h5 mb-2 text-dark text-truncate"
                        href={`/blog/${ele?.blogSlug}`}
                      >
                        {ele?.blogSlug}
                      </Link>
                      <p className="text-muted mb-3" style={{ flexGrow: 1 }}>
                        {ele?.blogContent?.slice(0, 80)}...
                      </p>

                      {/* Footer */}
                      <div className="text-muted border-top pt-2 d-flex justify-content-between small">
                        <span>
                          <i className="fa fa-calendar text-primary me-1"></i>
                          {ele?.blogDate}
                        </span>
                        <span>
                          <i className="fa fa-user text-primary me-1"></i>
                          {ele?.publisherName}
                        </span>
                      </div>
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

      <Footer />
    </>
  );
}
