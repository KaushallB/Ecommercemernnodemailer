import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { toast } = useToast();

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast({
        title: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }
    
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: "Feature image uploaded successfully!",
        });
      } else {
        toast({
          title: "Failed to upload image",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteFeatureImage(imageId) {
    dispatch(deleteFeatureImage(imageId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({
          title: "Feature image deleted successfully!",
        });
      } else {
        toast({
          title: "Failed to delete image",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-600">🌱 Eco-Cart Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage featured images for your eco-friendly marketplace</p>
      </div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      <button 
        onClick={handleUploadFeatureImage} 
        disabled={!uploadedImageUrl || imageLoadingState}
        className={`mt-5 w-full h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          !uploadedImageUrl || imageLoadingState 
            ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {imageLoadingState ? "Uploading..." : "Upload"}
      </button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div key={featureImgItem._id} className="relative group">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <button
                  onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  className="absolute top-2 right-2 bg-red-400 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  title="Delete Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
