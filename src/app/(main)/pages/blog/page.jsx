"use client"
import api from '@/_utils/api'
import { Link } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


const page = () => {
    const [blogsData, setBlogsData] = useState([])


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

    useEffect(() => {
        getallBlogs()
    }, [])

    return (
        <>
            {/* <!-- Page Header Start --> */}
            <div className="container-fluid page-header wow fadeIn" data-wow-delay="0.1s">
                <div className="container">
                    <h1 className="display-3 mb-3 animated slideInDown">Blog Grid</h1>
                    <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a className="text-body" href="/">Home</a></li>
                            <li className="breadcrumb-item"><a className="text-body" href="/pages">Pages</a></li>
                            <li className="breadcrumb-item text-dark active" aria-current="pages/blog">Blog Grid</li>
                        </ol>
                    </nav>
                </div>
            </div>
            {/* <!-- Page Header End --> */}


            {/* <!-- Blog Start --> */}
            <div className="container-xxl py-6">
                <div className="container">
                    <div className="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "500px" }}>
                        <h1 className="display-5 mb-3">Latest Blog</h1>
                        <p>Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
                    </div>
                    <div className="row g-4">
                        {blogsData && blogsData.length > 0 ? (
                            blogsData.map((ele, ind) => (
                                <div key={ind} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                                    <div className="blog-card card shadow-sm rounded-3 w-100">

                                        {/* Blog Image */}
                                        <img
                                            className="card-img-top"
                                            src={ele?.blogImage || "img/blog-1.jpg"}
                                            alt={ele?.blogName || "Blog Image"}
                                        />

                                        {/* Card Body */}
                                        <div className="card-body d-flex flex-column">
                                            <Link className="d-block h5 mb-2 text-dark text-truncate" href="*">
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
                                    style={{ maxWidth: "600px" }}
                                />
                            </div>
                        )}
                        <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.1s">
                            <a className="btn btn-primary rounded-pill py-3 px-5" href="">Load More</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Blog End --> */}


        </>
    )
}

export default page
