import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    try {
      const data = new FormData();
      data.append("my_file", imageFile);
      
      console.log("🔄 Starting upload to Cloudinary...", imageFile.name);
      console.log("📁 File size:", (imageFile.size / 1024 / 1024).toFixed(2), "MB");
      
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data,
        {
          timeout: 60000, // Increase to 60 seconds for large files
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`📤 Upload progress: ${percentCompleted}%`);
          }
        }
      );
      
      console.log("✅ Full response received:", response);
      console.log("✅ Response data:", response.data);
      console.log("✅ Response status:", response.status);

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
        console.log("🎉 Upload successful! URL:", response.data.result.url);
      } else {
        console.error("❌ Upload failed - Success: false", response.data);
        setImageLoadingState(false);
      }
    } catch (error) {
      console.error("🚨 Upload error:", error);
      console.error("🚨 Error details:", error.response?.data || error.message);
      setImageLoadingState(false);
      
      // Show user-friendly error
      if (error.code === 'ECONNABORTED') {
        console.error("⏰ Upload timed out - file might be too large");
      } else if (error.response?.status === 500) {
        console.error("🔧 Server error - check server logs");
      } else if (!error.response) {
        console.error("🌐 Network error - check if server is running on port 5000");
      }
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed border-red-400 rounded-lg p-4 hover:border-red-500 transition-colors`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-red-400 mb-2" />
            <span className="text-gray-600">Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex flex-col items-center justify-center h-32">
            <Skeleton className="h-10 bg-gray-100 mb-2" />
            <span className="text-sm text-gray-500">Uploading to Cloudinary...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-red-400 mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <button
              className="h-10 w-10 rounded-md text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
