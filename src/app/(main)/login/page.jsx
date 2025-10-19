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
  const [otp, setOtp] = useState('');
  const [type, setType] = useState(null)
  const [errorMsg, setErrorMsg] = useState('');
  const [userId, setUserId] = useState(null);
  const session = useSession();
  const role = session?.data?.user?.role;
  const loginType = session?.data?.user?.loginType

  const onSubmit = async (data) => {
    try {
      setErrorMsg('')

      if (!data.contact) {
        setErrorMsg("Email or phone is required");
        return;
      }

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact);
      const isPhone = /^\d{10}$/.test(data.contact);

      const type = isEmail ? 1 : isPhone ? 2 : null;
      if (!type) {
        setErrorMsg('Invalid email or phone number');
        return;
      }

      const res = await api.post(`/user/login`, {
        contact: data.contact,
        type,
      });

      if (res.data.status == 1) {
        setUserId(res?.data?.data?.id)
        setType(res.data.data.type)
        setOtpUI(true);
      } else {
        setErrorMsg(res.data.message);
        toast.error(res.data.message)
      }

    } catch (err) {
      console.log(err, "error")
      setErrorMsg(err.response?.data?.message || 'Something went wrong');
    }
  };


  const onVerifyOTP = async (e) => {
    try {
      e.preventDefault()
      setErrorMsg('')
      if (!otp || otp.length < 4) {
        setErrorMsg("OTP is required");
        return;
      }

      if (type !== 1 && type !== 2) {
        setErrorMsg("Invalid contact type");
        return;
      }

      const res = await api.post(`/user/verify-otp`, {
        id: userId, otp, type: type
      });


      // console.log("Verify using type:", type); // 👀 must be 1 (email) or 2 (phone)

      // console.log(res.data,"type")


      if (res.data.status == 1) {
        localStorage.setItem("token", res.data.data.token);
        toast.success(res.data.message);
        await signIn("credentials", { id: res.data.data.id, name: res.data.data.name, role: res.data.data.role, loginType: 1, redirect: false })
      } else {
        setErrorMsg(res.data.message);
        toast.error(res.data.message)
      }
      router.replace("/");
    } catch (err) {
      console.log(err, "error")
      setErrorMsg(err.response?.data?.message || 'Something went wrong');
    }
  }




  useEffect(() => {
    if (role === "User" && loginType === 0) {
      router.replace("/login")
    }
  }, [role])

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <h3 className="text-center text-success mb-4">User Register</h3>

          {!otpUI ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                  className={`form-control ${(errors.contact || errorMsg) ? "border-danger" : ""}`}
                  {...register("contact", {
                    required: "Email or phone number is required",
                    validate: (value) => {
                      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                      const isPhone = /^\d{10}$/.test(value);
                      return isEmail || isPhone || "Enter a valid email or 10-digit phone number";
                    }
                  })}
                />

                {errors.contact ? (
                  <span className="text-danger"><small>{errors.contact.message}</small></span>
                ) : errorMsg ? (
                  <p className="text-danger mt-2">{errorMsg}</p>
                ) : null}

              </div>

              <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Continue"}
              </button>

              <p className="text-center mt-3">
                Already have an account? <Link href="/signup" className="text-success">Signup</Link>
              </p>
            </form>
          ) : (
            <form id="otp-form" onSubmit={onVerifyOTP}>
              <h5 className="text-center mb-3">OTP Verification</h5>
              <p className="text-center text-muted">Enter the 4-digit code sent to your mobile number</p>

              <div className="d-flex justify-content-center mb-3">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
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
