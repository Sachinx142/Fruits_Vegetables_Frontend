'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/_utils/api';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [otpUI, setOtpUI] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('')

  const [userId, setUserId] = useState(null);
  const session = useSession();
  const role = session?.data?.user?.role;

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/user/register', data);
      if (res.data.status === 1) {
        toast.success(res.data.message);
        setUserId(res?.data?.data?.id);
        setOtpUI(true);
      } else {
        toast.error(res.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    }
  };

  const onVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/registerVerifyOtp', {
        id: userId,
        emailOtp: emailOtp,
        phoneOtp: phoneOtp
      });
      if (res.data.status == 1) {
        localStorage.setItem("token", res.data.data.token);
        toast.success(res.data.message);
        await signIn("credentials", { id: res.data.data.id, role: res.data.data.role, loginType: 0, redirect: false });
        router.replace("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed");
    }
  };

  useEffect(() => {
    if (role === "user") {
      router.replace("/login");
    }
  }, [role]);

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <h3 className="text-center text-success mb-4">User Register</h3>

          {!otpUI ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Full Name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                  })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Phone Number"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" }
                  })}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
              </div>

              <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Continue"}
              </button>

              <p className="text-center mt-3">
                Already have an account? <Link href="/login" className="text-success">Login</Link>
              </p>
            </form>
          ) : (
            <form >
              <h5 className="text-center mb-3">OTP Verification</h5>
              <p className="text-center text-muted">Enter the 4-digit code sent to your mobile number</p>

              <div className="d-flex justify-content-center mb-3">
                <div className="email-otp">
                  <h5>Email OTP</h5>
                  <OtpInput
                    value={emailOtp}
                    onChange={setEmailOtp}
                    numInputs={4}
                    renderInput={(props) => <input {...props}
                      style={{
                        width: "70px",
                        height: "70px",
                        fontSize: "24px",
                        textAlign: "center",
                        margin: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }} />}
                  />
                </div>


                <div className="phone-otp">
                  <h5>Phone OTP</h5>
                  <OtpInput
                    value={phoneOtp}
                    onChange={setPhoneOtp}
                    numInputs={4}
                    renderInput={(props) => <input {...props}
                      style={{
                        width: "70px",
                        height: "70px",
                        fontSize: "24px",
                        textAlign: "center",
                        margin: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }} />}
                  />
                </div>

              </div>
              <button type="submit" onClick={(e) => onVerifyOTP(e)} className="btn btn-success w-100">Verify OTP</button>

              <p className="text-center mt-2 text-muted">
                Didn't receive the code? <button type="button" className="btn btn-link p-0 text-success">Resend</button>
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
