"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  FacebookIcon,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "@/contexts/API";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      setTokenLoading(true);

      try {
        const res = await API.get(`/get-token`);
        setToken(res.data.token);
      } catch (error) {
        console.log(error);
      } finally {
        setTokenLoading(false);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (token && !tokenLoading) {
      redirect(`/`);
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email is required";
      if (!values.password) errors.password = "Password is required";
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("/login", values);
        toast.success(res.data.message);
        console.log(res);
        window.location.reload();
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.error || "Login failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div
          className="bg-[var(--surface)] rounded-3xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Panel */}
            <div className="lg:w-1/2 bg-[var(--surface-elevated)] p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--text-primary)] opacity-5"></div>
              <div className="relative z-10 text-center">
                <div className="w-80 h-80 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-[var(--text-primary)] rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-32 h-32 bg-[var(--text-primary)] rounded-2xl flex items-center justify-center"
                      style={{ boxShadow: "var(--shadow-xl)" }}
                    >
                      <User size={48} className="text-[var(--bg)]" />
                    </div>
                  </div>
                  <div className="absolute top-16 right-16 w-16 h-16 bg-[var(--text-primary)] rounded-xl animate-bounce"></div>
                  <div className="absolute bottom-20 left-12 w-12 h-12 bg-[var(--text-primary)] rounded-full animate-pulse"></div>
                  <div className="absolute top-32 left-8 w-8 h-8 bg-[var(--text-primary)] rounded-full animate-bounce delay-300"></div>
                </div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                  Welcome Back!
                </h2>
                <p className="text-[var(--text-muted)] text-lg">
                  Sign in to continue your journey with us
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Sign In
                  </h1>
                  <p className="text-[var(--text-muted)]">
                    Enter your credentials to access your account
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        size={20}
                        className="text-[var(--text-muted)] group-focus-within:text-[var(--text-primary)] transition-colors"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-12 pr-4 py-4 bg-[var(--surface-elevated)] rounded-2xl focus:bg-[var(--bg)] focus:outline-none transition-all duration-300 text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-md"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <small className="text-xs text-red-500 mt-1">
                        {formik.errors.email}
                      </small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        size={20}
                        className="text-[var(--text-muted)] group-focus-within:text-[var(--text-primary)] transition-colors"
                      />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-12 pr-12 py-4 bg-[var(--surface-elevated)] rounded-2xl focus:bg-[var(--bg)] focus:outline-none transition-all duration-300 text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                      <small className="text-xs text-red-500 mt-1">
                        {formik.errors.password}
                      </small>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="flex items-center justify-end">
                    <Link
                      href="/auth/forgot-password"
                      className="text-[var(--text-primary)] hover:text-[var(--text-muted)] font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--text-primary)] text-[var(--bg)] py-4 rounded-2xl font-semibold text-lg hover:bg-[var(--text-muted)] transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none disabled:text-[var(--border)] disabled:opacity-30"
                  >
                    Log In
                  </button>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border)]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[var(--surface)] text-[var(--text-muted)]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center py-3 px-4 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--surface)] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                    >
                      <FacebookIcon />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center py-3 px-4 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--surface)] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                    >
                      <Twitter />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center py-3 px-4 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--surface)] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                    >
                      <Linkedin />
                    </button>
                  </div>
                </form>

                {/* Register */}
                <div className="text-center mt-8">
                  <p className="text-[var(--text-muted)]">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-[var(--text-primary)] hover:text-[var(--text-muted)] font-semibold transition-colors"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
