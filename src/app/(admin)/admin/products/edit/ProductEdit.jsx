  "use client";
  import React, { useEffect, useMemo, useRef, useState } from "react";
  import dynamic from "next/dynamic";
  import { useForm } from "react-hook-form";
  import axios from "axios";
  import { useRouter, useSearchParams } from "next/navigation";
  import api from "@/_utils/api";
  import toast from 'react-hot-toast';
  import { set } from "mongoose";


  const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

  const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [categoryData, setCategoryData] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [description, setDescription] = useState(null);
    const editor = useRef(null);
    const [actualPrice,setActualPrice] = useState(0)
    const [discount,setDiscount] = useState(0);
    const [finalPrice,setFinalPrice] = useState(0)

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { isSubmitting, errors },
    } = useForm();

    const selectedCategoryId = watch("categoryId");


    const config = useMemo(() => ({
      readonly: false,
      placeholder: "Start typing...",
      height: "300px",
    }), []);


    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setProductImage(file);
    };


    const onSubmit = async (data) => {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("productSlug", data.productSlug);
      formData.append("categoryId", data.categoryId);
      formData.append("subcategoryId", data.subcategoryId);
      formData.append("actualPrice", actualPrice);
      formData.append("discountedPrice",discount);
      formData.append("finalPrice", finalPrice);
      formData.append("stock", data.stock);

      //takes text,html as it is
      formData.append("description", description);

      formData.append("seoTitle", data.seoTitle);
      formData.append("metaKeywords", data.metaKeywords);
      formData.append("metaDescription", data.metaDescription);

      //Blob or File and it contails object of file
      formData.append("productImage", data.productImage[0]);
      formData.append("id",id)

      try {
        const res = await api.post("/product/updateProduct", formData);
        if (res.data.status === 1) {
          toast.success(res.data.message)
          router.push('/admin/products')
        }
        else {
          toast.error(res.data.message)
        }
      } catch (error) {
        toast.error(res.data.message)
        console.error("Error saving product:", error);
      }
    };


    // getProductById
    const getProductDatabyId = async () => {
      try {
        const res = await api.post("/product/getProductById", { id });
        if (res.data.status === 1) {
          reset(res.data.data)
          setDescription(res.data.data.description)
          setProductImage(res.data.data.productImage)
          setActualPrice(res.data.data.actualPrice || 0);
          setDiscount(res.data.data.discount || 0)
          setFinalPrice(res.data.data.finalPrice || 0)
          getSubcategoriesByCategory(res.data.data.categoryId)
          setValue("subcategoryId", res.data.data.subcategoryId)
          setValue("categoryId", res.data.data.categoryId)
        }
        else {
          toast.error(res.data.error)
        }
      } catch (error) {
        console.log(error);
      }
    };




    const getActiveCategory = async () => {
      try {
        const res = await api.get("/category/getAllActiveCategory");
        if (res.data.status === 1) {
          setCategoryData(res.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getSubcategoriesByCategory = async (categoryId) => {
      try {
        const res = await api.post('/subcategory/getActiveSubCategoriesByCategoryId', { categoryId })
        if (res.data.status === 1) {
          setSubcategoryData(res.data.data);
        }
        else {
          setSubcategoryData([]);
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      if (selectedCategoryId) {
        getSubcategoriesByCategory(selectedCategoryId);
        setValue("subcategoryId", "");
      }
    }, [selectedCategoryId])

      useEffect(() => {
    const price = Number(actualPrice) || 0;
    const disc = Number(discount) || 0;
    const calc = price - (price * disc) / 100;
    setFinalPrice(calc.toFixed(2));
  }, [actualPrice, discount]);

    useEffect(() => {
      getSubcategoriesByCategory();
      getActiveCategory();
    }, [])


    useEffect(() => {
      if (id) {
        getProductDatabyId()
      }
    }, [id])


    return (
      <>
        <div className="container my-5">
          <h4 className="fw-bold text-light mb-4">🆕 Update Product</h4>

          <form className="bg-white p-4 rounded shadow-sm" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <label htmlFor="example-select" className="form-label">Category</label>
                  <select id="example-select" className={`form-select ${errors.categoryId ? "border-danger" : ""}`} {...register("categoryId", {
                    required: {
                      value: true,
                      message: "Please select Category.!"
                    }
                  })}>
                    <option defaultChecked hidden value={""}>Select Category</option>
                    {
                      categoryData?.map((ele, ind) =>
                        <option value={ele._id} key={ind}>{ele.categoryName}</option>)
                    }
                  </select>
                  {
                    errors.categoryId && <span className="help-block text-danger"><small>{errors.categoryId.message}</small></span>
                  }
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-4">
                  <label htmlFor="example-select" className="form-label">SubCategory</label>
                  <select id="example-select" className={`form-select ${errors.subcategoryId ? "border-danger" : ""}`} {...register("subcategoryId", {
                    required: {
                      value: true,
                      message: "Please select SubCategory.!"
                    }
                  })}>
                    <option defaultChecked hidden value={""}>Select Sub-Category</option>
                    {
                      subcategoryData?.map((ele, ind) =>
                        <option value={ele._id} key={ind}>{ele.subCategoryName}</option>)
                    }
                  </select>
                  {
                    errors.subcategoryId && <span className="help-block text-danger"><small>{errors.subcategoryId.message}</small></span>
                  }
                </div>
              </div>

            </div>




            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Product Name</label>
                <input className={`form-control ${errors.productName ? 'border-danger' : ''}`} {...register("productName", {
                  required: {
                    value: true,
                    message: "Product Name is required"
                  }
                })} />
                {errors.productName && <span className="text-danger"><small>{errors.productName.message}</small></span>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Slug</label>
                <input className={`form-control ${errors.productSlug ? 'border-danger' : ''}`} {...register("productSlug", {
                  required: {
                    value: true,
                    message: "Product Slug is required"
                  }
                })} />
                {errors.productSlug && <span className="text-danger"><small>{errors.productSlug.message}</small></span>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Actual Price</label>
                <input className={`form-control ${errors.actualPrice ? 'border-danger' : ''}`} type="number" {...register("actualPrice", {
                  required: {
                    value: true,
                    message: "Actual Price is required"
                  }
                })} onChange={(e)=>setActualPrice(e.target.value)} />
                {errors.actualPrice && <span className="text-danger"><small>{errors.actualPrice.message}</small></span>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Discounted Price</label>
                <input className={`form-control ${errors.discountedPrice ? 'border-danger' : ''}`} type="number" {...register("discountedPrice", {
                  required: {
                    value: true,
                    message: "Discounted Price is required"
                  }
                })} onChange={(e)=>setDiscount(e.target.value)} />
                {errors.discountedPrice && <span className="text-danger"><small>{errors.discountedPrice.message}</small></span>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Final Price</label>
                <input
                  className={`form-control ${errors.finalPrice ? 'border-danger' : ''}`}
                  type="number"
                  {...register("finalPrice", {
                    required: {
                      value: true,
                      message: "Final Price is required"
                    }
                  })}
                  readOnly
                  value={finalPrice}
                />
                {errors.finalPrice && <span className="text-danger"><small>{errors.finalPrice.message}</small></span>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Stock</label>
                <input className={`form-control ${errors.stock ? 'border-danger' : ''}`} type="number" {...register("stock", {
                  required: {
                    value: true,
                    message: "Stock is required"
                  }
                })} />
                {errors.stock && <span className="text-danger"><small>{errors.stock.message}</small></span>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Product Image</label>
                <input className={`form-control ${errors.productImage ? 'border-danger' : ''}`} type="file" accept="image/*"  {...register("productImage", {
                  required: {
                    value: true,
                    message: "Product Image is required"
                  },
                  onChange: handleImageChange
                })} />
                {
                  errors.productImage && <span className="help-block text-danger"><small>{errors.productImage.message}</small></span>
                }
                {productImage && (
                  <img
                    src={typeof productImage === 'string' ? productImage : URL.createObjectURL(productImage)}
                    alt="Product"
                    className="mt-3"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                )}

              </div>


              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <JoditEditor
                  ref={editor}
                  value={description}
                  config={config}
                  tabIndex={1}
                  onChange={(newContent) => setDescription(newContent)}
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="mt-4 border-top pt-4">
              <h5 className="fw-bold mb-3">🔍 SEO Details</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">SEO Title</label>
                  <input className={`form-control ${errors.seoTitle ? 'border-danger' : ''}`} {...register("seoTitle", {
                    required: {
                      value: true,
                      message: "SEO Title is required"
                    }
                  })} />
                  {errors.seoTitle && <span className="text-danger"><small>{errors.seoTitle.message}</small></span>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">SEO Keywords</label>
                  <input className={`form-control ${errors.metaKeywords ? 'border-danger' : ''}`} {...register("metaKeywords", {
                    required: {
                      value: true,
                      message: "Meta Keywords is required"
                    }
                  })} />
                  {errors.metaKeywords && <span className="text-danger"><small>{errors.metaKeywords.message}</small></span>}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Meta Description</label>
                  <textarea className={`form-control ${errors.metaDescription ? 'border-danger' : ''}`} rows={2} {...register("metaDescription", {
                    required: {
                      value: true,
                      message: "Meta Description is required"
                    }
                  })}></textarea>
                  {errors.metaDescription && <span className="text-danger"><small>{errors.metaDescription.message}</small></span>}
                </div>
              </div>
            </div>

            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success px-4">💾 Update</button>
            </div>
          </form>
        </div>
      </>
    );
  };

  export default Page;
