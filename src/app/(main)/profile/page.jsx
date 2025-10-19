"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import api from "@/_utils/api";
import toast from "react-hot-toast";
import { formatDateForInput } from "@/_helper/frontend/dbFormatter";


export default function ProfileForm() {
  const session = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues:{
      date_of_birth:null
    }
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [userProfileData, setUserProfileData] = useState([]);
  const id = session?.data?.user?.id;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicturePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

   const getUserProfile = async () => {
  try {
    const res = await api.post("/user/getUserProfile", { id });

    if (res.data.status === 1) {
      const user = res.data.data;

        user.date_of_birth =  formatDateForInput(user.date_of_birth)

      setUserProfileData(user);
      reset(user);

      if (user.profilePicture) {
        setProfilePicturePreview(user.profilePicture);
      }

    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch profile");
    console.error(error);
  }
};

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("address", data.address);
      formData.append("id", id);

      if (profileFile) {
        formData.append("profilePicture", profileFile);
      }

      const res = await api.post("/user/updateUserProfile", formData);

      if (res.data.status === 1) {
        toast.success(res.data.message);
        getUserProfile();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error!");
      console.error(error);
    }
  };

  const handleLogout = () => {
    reset();
    setProfileFile(null);
    setProfilePicturePreview("");
  };

  useEffect(() => {
    if (id) {
      getUserProfile();
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container py-5 mt-5 margin-top-user">
        <div className="row justify-content-center">
          {/* LEFT SIDE: PROFILE CARD */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body text-center p-4">
                <div className="position-relative d-inline-block mb-3">
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto shadow-sm"
                    style={{
                      width: "160px",
                      height: "160px",
                      overflow: "hidden",
                    }}
                  >
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Camera size={64} className="text-secondary" />
                    )}
                  </div>

                  <label
                    htmlFor="profilePicture"
                    className="position-absolute bottom-0 end-0 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle shadow"
                    style={{
                      width: "42px",
                      height: "42px",
                      cursor: "pointer",
                      border: "2px solid white",
                    }}
                  >
                    <Camera size={18} />
                    <input
                      type="file"
                      className="d-none"
                      accept="image/*"
                      id="profilePicture"
                      {...register("profilePicture", {
                        onChange: handleImageChange,
                      })}
                    />
                  </label>
                </div>

                <h4 className="fw-bold mb-1">
                  {userProfileData?.fullName || "Your Name"}
                </h4>
                <p className="text-muted mb-3 small">
                  {userProfileData?.email || "your.email@example.com"}
                </p>
                <button
                  type="button"
                  className="btn btn-outline-dark w-100 rounded-pill"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM CARD */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                    Basic Profile
                  </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Full Name:
                      </label>
                      <input
                        {...register("fullName", {
                          required:{
                            value:true,
                            message:"Full Name is required*"
                          },
                        })}
                        className={`form-control rounded-3 ${
                          errors.fullName ? "border-danger" : ""
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.fullName && (
                        <small className="text-danger">
                          {errors.fullName.message}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address:
                      </label>
                      <input
                        {...register("email", {
                          required: { value: true, message: "Email Address is required*" },
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address*",
                          },
                        })}

                        className={`form-control rounded-3 ${
                          errors.email ? "border-danger" : ""
                        }`}
                        placeholder="Enter email"
                      />
                      {errors.email && (
                        <small className="text-danger">
                          {errors.email.message}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number:
                      </label>
                      <input
                        {...register("phone", {
                          required: { value: true, message: "Phone no is required*" },
                          pattern: {
                            value: /^[0-9]{10}$/, 
                            message: "Enter a valid 10-digit phone number*",
                          },
                        })}

                        className={`form-control rounded-3 ${
                          errors.phone ? "border-danger" : ""
                        }`}
                        placeholder="Enter phone"
                      />
                      {errors.phone && (
                        <small className="text-danger">
                          {errors.phone.message}
                        </small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Date of Birth:
                      </label>
                      <input
                        type="date"
                        {...register("date_of_birth", {
                          required:{
                            value:true,
                            message:"Date is required*"
                          },
                        })}
                        className={`form-control rounded-3 ${
                          errors.date_of_birth ? "border-danger" : ""
                        }`}
                      />
                      {errors.date_of_birth && (
                        <small className="text-danger">
                          {errors.date_of_birth.message}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Address:</label>
                    <textarea
                      {...register("address", {
                        required:{
                          value:true,
                          message: "Address is required*"
                        },
                      })}
                      className={`form-control rounded-3 ${
                        errors.address ? "border-danger" : ""
                      }`}
                      rows={3}
                      placeholder="Enter address"
                    ></textarea>
                    {errors.address && (
                      <small className="text-danger">
                        {errors.address.message}
                      </small>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
