'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import api from '@/_utils/api';

const WishlistPage = () => {
    const session = useSession();
    const id = session?.data?.user?.id;
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserWishlist = async () => {
        if (!id) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await api.post(
                '/wishlist/getAllWishlists',
                { user: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.status === 1) {
                // store full product objects, not just IDs
                setWishlistProducts(res.data.data.map((item) => item.product));
            } else {
                setWishlistProducts([]);
            }
        } catch (error) {
            console.error('Wishlist fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await api.post(
                '/wishlist/deleteWishlist',
                { user: id, product: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.status === 1) {
                setWishlistProducts((prev) =>
                    prev.filter((p) => p._id !== productId)
                );
            }
        } catch (error) {
            console.error('Remove wishlist error:', error);
        }
    };

    useEffect(() => {
        if (id) {
            getUserWishlist();
        }
    }, [id]);

    if (loading) {
        return (
            <>
                <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: "70vh" }}
                >
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-3">Loading your wishlist...</p>
                </div>
            </>
        );
    }


    return (
        <>
            <div className="text-center mb-5 padding-content-wishlist mt-5">
                <h2 className="fw-bold text-primary">
                    <i className="fa fa-heart me-2"></i>My Wishlist
                </h2>
                <p className="text-muted mb-0">Your favorite items saved for later</p>
            </div>

            {wishlistProducts.length > 0 ? (
                wishlistProducts.map((product) => (
                    <div
                        key={product._id}
                        className="card border-0 shadow-sm rounded-4 mb-4"
                    >
                        <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Link href={`/product/${product?.productSlug}`} className="me-3">
                                    <img
                                        src={product.productImage || '/placeholder.png'}
                                        alt={product.productName}
                                        className="rounded-3"
                                        width="120"
                                    />
                                </Link>
                                <div>
                                    <Link
                                        href={`/product/${product?.productSlug}`}
                                        className="text-dark text-decoration-none"
                                    >
                                        {product?.productName}
                                    </Link>
                                    <p
                                        className="text-muted small mb-2"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                    <div className="mb-1">
                                        <span className="fw-bold text-primary fs-5 me-2">
                                            ₹{product.finalPrice}
                                        </span>
                                        <del className="text-muted small">{product.actualPrice}</del>
                                        {product.discountedPrice && (
                                            <span className="badge bg-success ms-2">
                                                {product.discountedPrice}% off
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-end mt-3 mt-md-0">
                                <button
                                    className="btn btn-danger btn-sm curve"
                                    onClick={() => removeFromWishlist(product._id)}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                    <i className="fa fa-heart-broken fa-3x text-danger mb-3"></i>
                    <h5 className="fw-semibold">Your wishlist is empty</h5>
                    <p className="text-muted">Add products you love to buy them later</p>
                    <a href="/" className="btn btn-primary">
                        <i className="fa fa-shopping-bag me-2"></i>Continue Shopping
                    </a>
                </div>
            )}
        </>
    );
};

export default WishlistPage;
