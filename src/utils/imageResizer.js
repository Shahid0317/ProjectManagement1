/**
 * Compresses and resizes images on the client-side to optimize storage and upload speed.
 * @param {File} file - The original image file.
 * @param {Object} options - Configuration for resizing.
 * @returns {Promise<Blob>} - The compressed image as a Blob.
 */
export const compressImage = (file, options = { maxWidth: 1200, quality: 0.7 }) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > options.maxWidth) {
            height = Math.round((height * options.maxWidth) / width);
            width = options.maxWidth;
          }
        } else {
          if (height > options.maxWidth) {
            width = Math.round((width * options.maxWidth) / height);
            height = options.maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Attach properties directly to the Blob for maximum cross-browser compatibility
              blob.name = file.name;
              blob.lastModified = Date.now();
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          options.quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
