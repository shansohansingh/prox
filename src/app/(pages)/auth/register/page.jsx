"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  Phone,
  FacebookIcon,
  Twitter,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import API from "@/contexts/API";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      name: "",
      email: "",
      contact: "",
      password: "",
      agreed: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      contact: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
        .required("Contact number is required"),
      password: Yup.string()
        .min(6, "Min 6 characters")
        .required("Password is required"),
      agreed: Yup.boolean().oneOf([true], "You must accept terms"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await API.post(`/register`, values);
        toast.success(response?.data?.message);
        console.log("object");
        router.push(`/auth/verify/${values.email}`);
      } catch (error) {
        toast.error(error?.response?.data?.error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div
          className="bg-[var(--surface)] rounded-3xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-xl)" }}
        >
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left part (same as before) */}
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
                  Join Us!
                </h2>
                <p className="text-[var(--text-muted)] text-lg">
                  Create your account to start your journey
                </p>
              </div>
            </div>

            {/* Right - Register Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                    Sign Up
                  </h1>
                  <p className="text-[var(--text-muted)]">
                    Create your account in seconds
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={20} className="text-[var(--text-muted)]" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-md"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <small className="text-red-500 text-xs mt-1">
                        {formik.errors.name}
                      </small>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={20} className="text-[var(--text-muted)]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-md"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <small className="text-red-500 text-xs mt-1">
                        {formik.errors.email}
                      </small>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={20} className="text-[var(--text-muted)]" />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="Contact Number"
                      onChange={formik.handleChange}
                      value={formik.values.contact}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-md"
                    />
                    {formik.touched.contact && formik.errors.contact && (
                      <small className="text-red-500 text-xs mt-1">
                        {formik.errors.contact}
                      </small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={20} className="text-[var(--text-muted)]" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[var(--surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                      <small className="text-red-500 text-xs mt-1">
                        {formik.errors.password}
                      </small>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-2 text-sm">
                    <input
                      id="terms"
                      name="agreed"
                      type="checkbox"
                      onChange={formik.handleChange}
                      checked={formik.values.agreed}
                      className="mt-1 accent-[var(--text-primary)]"
                    />
                    <label htmlFor="terms" className="text-[var(--text-muted)]">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-[var(--text-primary)] underline hover:text-[var(--text-muted)]"
                      >
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !formik.values.agreed}
                    className="w-full bg-[var(--text-primary)] text-[var(--bg)] py-4 rounded-2xl font-semibold text-lg hover:bg-[var(--text-muted)] transition-all duration-300 disabled:text-[var(--border)] disabled:opacity-30"
                  >
                    Create Account
                  </button>

                  {/* Divider and social buttons remain unchanged */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border)]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[var(--surface)] text-[var(--text-muted)]">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  {/* Social */}
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

                  {/* Already have account */}
                  <div className="text-center mt-8">
                    <p className="text-[var(--text-muted)]">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login"
                        className="text-[var(--text-primary)] hover:text-[var(--text-muted)] font-semibold transition-colors"
                      >
                        Log in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
