"use client";
import api from "@/_utils/api";
import Footer from "@/component/Footer";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Image from "next/image";

function Page() {
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const pathname = usePathname();
  const productSlug = pathname.split("/")[2];

  const getProductData = async () => {
    try {
      const res = await api.post("/product/getProductBySlug", { productSlug });
      if (res.data.status === 1) {
        setProductData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
  const token = localStorage.getItem("token"); 

  if (!productData) return;

  if (!quantity || quantity <= 0) {
    toast.error("Please enter a valid quantity");
    return;
  }

  if (!token) {
    // Guest user: save to localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.productId === productData._id);

    if (existing) {
      existing.qty += quantity;
    } else {
      cart.push({
        productId: productData._id,
        productName: productData.productName,
        productImage: productData.productImage,
        price: productData.finalPrice,
        qty: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart (local storage)!");
    return;
  }

  try {
    const res = await api.post(
      "/cart/addCart",
      {
        productId: productData._id,
        qty: quantity,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.status === 1) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message || "Failed to add to cart");
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Server error");
  }
};


  useEffect(() => {
    if (productSlug){
       getProductData();
    }
  }, [productSlug, getProductData]);

  if (!productData) {
    return (
      <>
        <div className="container my-5 text-center">
          <h4>Loading product details...</h4>
        </div>
      </>
    );
  }

  return (
    <>

      <div className="container my-5 product-details">
        <div className="row g-4 align-items-start">
          {/* Product Image */}
          <div className="col-lg-5">
            <div className="card shadow-sm p-3 mt-2">
              <img
                src={productData?.productImage}
                alt={productData.productName}
                className="img-fluid rounded"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-7">
            <h2 className="fw-bold">{productData.productName || 'N/A'}</h2>

            <div className="d-flex align-items-center mb-3">
              <h4 className="text-success me-3 mb-0">
                ₹{productData.finalPrice || 'N/A'}
              </h4>
              <span className="text-muted text-decoration-line-through me-3">
                ₹{productData.actualPrice || 'N/A'}
              </span>
              <span className="badge bg-danger">
                {Math.round(
                  (productData.discountedPrice / productData.actualPrice) * 100
                )}
                % OFF
              </span>
            </div>

            <p className="text-success">In Stock: {productData.stock || 'N/A'}</p>

            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                value={quantity}
                min="1"
                max={productData.stock}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control w-25"
              />
            </div>

            <div className="d-flex gap-3 mb-4">
              <button
                className="btn btn-primary px-4 d-flex align-items-center gap-2"
                onClick={handleAddToCart}
              >
                <FaShoppingCart size={16} />
                Add to Cart
              </button>
              {/* Add to Wishlist */}
              <button className="btn btn-success px-4 d-flex align-items-center gap-2">
                <FaHeart size={16} />
                Add to Wishlist
              </button>
            </div>

            {/* Description */}
            <div className="card p-3 mb-4 shadow-sm">
              <h5>Description</h5>
              <div
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>

            {/* Product Details Table */}
            <div className="card p-3 shadow-sm">
              <h5>Product Details</h5>
              <div className="table-responsive">
                <table className="table table-sm table-bordered align-middle mb-0">
                  <tbody>
                    <tr>
                      <th>Product Name</th>
                      <td>{productData?.productName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Category</th>
                      <td>{productData?.categoryId?.categoryName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Subcategory</th>
                      <td>{productData.subcategoryId?.subCategoryName || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>₹{productData.finalPrice || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Discount</th>
                      <td>₹{productData.discountedPrice || 'N/A'} off</td>
                    </tr>
                    <tr>
                      <th>Stock</th>
                      <td>{productData.stock || 'N/A'} in Stock</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Page;
