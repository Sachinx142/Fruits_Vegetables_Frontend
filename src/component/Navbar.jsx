'use client'
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const Navbar = () => {
    const pathname = usePathname()
    const session = useSession();
    const role = session?.data?.user?.role
    const loginType = session?.data?.user?.loginType;
    const userName = session?.data?.user?.name

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <>
            {/* <!-- Navbar Start --> */}
            <div className="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s">
                <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
                    <div className="col-lg-6 px-5 text-start">
                        <small><i className="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small>
                        <small className="ms-4"><i className="fa fa-envelope me-2"></i>info@example.com</small>
                    </div>
                    <div className="col-lg-6 px-5 text-end">
                        <small>Follow us:</small>
                        <Link className="text-body ms-3" href=""><i className="fab fa-facebook-f"></i></Link>
                        <Link className="text-body ms-3" href=""><i className="fab fa-twitter"></i></Link>
                        <Link className="text-body ms-3" href=""><i className="fab fa-linkedin-in"></i></Link>
                        <Link className="text-body ms-3" href=""><i className="fab fa-instagram"></i></Link>
                    </div>
                </div>

                <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
                    <Link href="/" className="navbar-brand ms-4 ms-lg-0">
                        <h1 className="fw-bold text-primary m-0">F<span className="text-secondary">oo</span>dy</h1>
                    </Link>
                    <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="navbar-nav ms-auto p-4 p-lg-0">
                            <Link href="/" className="nav-item nav-link active">Home</Link>
                            <Link href="/about" className="nav-item nav-link">About Us</Link>
                            {role === "User" && loginType == 1 && (
                                <Link href="/product" className={`nav-item nav-link ${pathname === '/product' ? 'active' : ''}`}>Products</Link>
                            )}

                            <div className="nav-item dropdown">
                                <Link href="/pages" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</Link>
                                <div className="dropdown-menu m-0">
                                    <Link href="/pages/blog" className="dropdown-item">Blog Grid</Link>
                                    <Link href="/pages/feature" className="dropdown-item">Our Features</Link>
                                    <Link href="/pages/testimonial" className="dropdown-item">Testimonial</Link>
                                    <Link href="/pages/errorPage" className="dropdown-item">404 Page</Link>
                                </div>
                            </div>
                            <Link href="/contact" className="nav-item nav-link">Contact Us</Link>
                        </div>
                        <div className="d-none d-lg-flex ms-2">

                            {role === "User" && loginType == 1 ? (
                                <div className="nav-item dropdown">
                                    <Link href="#" className="btn-sm-square bg-white rounded-circle ms-3 dropdown-toggle" data-bs-toggle="dropdown">
                                        <small className="fa fa-user text-body"></small>
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-end m-0 p-2">
                                        <span className="dropdown-item-text fw-bold">👋 Hi, {userName || 'User'}</span>
                                        <hr className="dropdown-divider" />
                                        <Link href="/profile" className="dropdown-item">
                                            <i className="fa fa-user me-2 text-secondary"></i> My Profile
                                        </Link>
                                        <Link href="/orders" className="dropdown-item">
                                            <i className="fa fa-box me-2 text-primary"></i> Orders
                                        </Link>
                                        <Link href="/wishlist" className="dropdown-item">
                                            <i className="fa fa-heart me-2 text-danger"></i> Wishlist
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item text-danger">
                                            <i className="fa fa-sign-out-alt me-2"></i> Logout
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                <Link className="btn-sm-square bg-white rounded-circle ms-3" href="/login">
                                    <small className="fa fa-user text-body"></small>
                                </Link>
                            )}
                            <Link className="btn-sm-square bg-white rounded-circle ms-3" href="/cart">
                                <small className="fa fa-shopping-bag text-body"></small>
                            </Link>

                        </div>
                    </div>
                </nav>
            </div>
            {/* <!-- Navbar End --> */}
        </>
    )
}

export default Navbar
