'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', {
        email,
        password
      })

      const data = res.data;

      if (data.status === 1) {
        toast.success('Login successful! Redirecting...', {
          position: 'top-right',
        });

        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      }
      else {
        toast.error(data.message || 'Invalid credentials.', {
          position: 'top-right',
        });
      }

    } catch (error) {
      toast.error("Server error. Try again later.", {
        position: 'top-right',
      });
      console.error("Login error:", error);
    }
  }


  return (
    <>
      {/* Toast container */}
      <ToastContainer />

      <div className="d-flex min-vh-100">
        {/* Left: Image Side */}
        <div className="d-none d-md-flex flex-column justify-content-center align-items-center bg-primary text-white w-50 p-5">
          <h1 className="display-5 fw-bold mb-3">Welcome Back!</h1>
          <p className="lead text-center">
            Securely manage your admin dashboard with ease and confidence.
          </p>
          <img
            src="https://static.vecteezy.com/system/resources/previews/003/689/228/non_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
            alt="Admin Illustration"
            className="img-fluid mt-4"
            style={{ maxWidth: '80%', borderRadius: '50%' }}
          />
        </div>

        {/* Right: Login Form */}
        <div className="d-flex justify-content-center align-items-center w-100 w-md-50 bg-light px-3">
          <div
            className="card shadow-sm border-0 p-4 p-md-5"
            style={{
              maxWidth: '420px',
              width: '100%',
              borderRadius: '1rem',
              backgroundColor: '#ffffffdd',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">Admin Login</h2>
              <p className="text-muted small">Sign in to access your dashboard</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="adminEmail" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="admin@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="adminPassword" className="form-label fw-semibold">
                  Password
                </label>

                <div className="position-relative">
                  <input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg pe-5"
                    placeholder="********"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="position-absolute top-50 end-0  translate-middle-y me-3"
                    style={{ cursor: 'pointer', zIndex: 2 }}
                  >
                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100">
                Login
              </button>
            </form>
            <div className="text-center mt-4">
              <small className="text-muted">For authorized admin users only</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}