import { Camera, Trash2, Upload, User, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Cropper } from "react-advanced-cropper";

export default function ProfileImage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef();
  const cropperRef = useRef();

  const handleCropComplete = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        const croppedImage = canvas.toDataURL();
        setImagePreview(croppedImage);
        setShowCropper(false);
        setOriginalImage(null);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
  };
  return (
    <>
      <div className="space-y-6">
        <div className="bg-[var(--surface)] rounded-2xl p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-[var(--b)] flex items-center justify-center relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-[var(--text-primary)]" />
                )}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] rounded-xl font-medium shadow-sm hover:bg-[var(--text-muted)] transition-all duration-200"
              >
                <Upload size={18} />
                Upload Photo
              </button>

              {imagePreview && (
                <button
                  onClick={handleDeleteImage}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200"
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="text-center">
              <p className="text-sm text-[var(--text-muted)]">
                Recommended: Square image, at least 400x400px
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                JPG, PNG or GIF. Max file size 5MB.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showCropper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Crop Your Photo
              </h3>
              <button
                onClick={() => setShowCropper(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-96 mb-4">
              <Cropper
                ref={cropperRef}
                src={originalImage}
                className="h-full"
                aspectRatio={1}
                guides={true}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCropper(false)}
                className="px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] rounded-lg hover:bg-[var(--text-muted)] transition-all duration-200"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
