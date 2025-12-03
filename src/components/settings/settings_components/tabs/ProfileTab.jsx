import { Camera, Edit3, Save, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProfileImage from "./profile_components/ProfileImage";
import API from "@/contexts/API";

export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState("photo");
  const [isEditing, setIsEditing] = useState(false);
  const [authUser, setAuthUser] = useState("");

  const getAuthUser = useCallback(async () => {
    try {
      const response = await API.get(`/get-profile`);
      setAuthUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAuthUser();
  }, [getAuthUser]);

  const initialValues = {
    fullName: authUser?.name || "",
    email: authUser?.email || "",
    username: "johndoe",
    bio: "AI enthusiast and developer passionate about creating innovative solutions.",
    location: "San Francisco, CA",
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric")
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    bio: Yup.string().max(200, "Bio can't be more than 200 characters"),
    location: Yup.string().required("Location is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsEditing(false);
      console.log("Saving profile data:", values);
    },
  });

  const handleCancel = () => {
    setIsEditing(false);
    formik.resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
            Profile Settings
          </h3>
          <p className="text-[var(--text-muted)] mt-1">
            Manage your personal information and profile picture
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-[var(--surface)] p-1 rounded-xl w-fit">
        {[
          { key: "photo", label: "Profile Photo", icon: Camera },
          { key: "info", label: "Personal Info", icon: Edit3 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === tab.key
                ? "bg-[var(--text-primary)] text-[var(--bg)] shadow-sm"
                : "text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "photo" ? (
        <ProfileImage />
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-[var(--surface)] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-[var(--text-primary)]">
                Personal Information
              </h4>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-lg transition-all duration-200"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] rounded-lg transition-all duration-200"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] rounded-lg transition-all duration-200"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-[var(--surface-elevated)] rounded-xl text-[var(--text-primary)] ${
                    isEditing
                      ? "focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:bg-[var(--bg)]"
                      : "cursor-default"
                  }`}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.fullName}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-[var(--surface-elevated)] rounded-xl text-[var(--text-primary)] ${
                    isEditing
                      ? "focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:bg-[var(--bg)]"
                      : "cursor-default"
                  }`}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-[var(--surface-elevated)] rounded-xl text-[var(--text-primary)] ${
                    isEditing
                      ? "focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:bg-[var(--bg)]"
                      : "cursor-default"
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-[var(--surface-elevated)] rounded-xl text-[var(--text-primary)] ${
                    isEditing
                      ? "focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:bg-[var(--bg)]"
                      : "cursor-default"
                  }`}
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.location}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-[var(--surface-elevated)] rounded-xl text-[var(--text-primary)] resize-none ${
                    isEditing
                      ? "focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:bg-[var(--bg)]"
                      : "cursor-default"
                  }`}
                />
                {formik.touched.bio && formik.errors.bio && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
