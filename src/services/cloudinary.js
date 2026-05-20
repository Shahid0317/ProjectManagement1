const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvz8oiaq3';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  const fileName = file.name || (file.type && file.type.startsWith('image/') ? 'image.jpg' : 'archive.zip');
  formData.append('file', file, fileName);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errMsg = response.statusText;
      try {
        const errData = await response.json();
        if (errData && errData.error && errData.error.message) {
          errMsg = errData.error.message;
        }
      } catch (e) {}
      throw new Error(`Cloudinary upload failed: ${errMsg}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
