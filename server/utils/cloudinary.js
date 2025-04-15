import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
  }
};

// Configure Cloudinary
try {
  validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error('Cloudinary configuration error:', error.message);
  throw error;
}

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'carecorner',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

// Create multer upload instance
export const upload = multer({ storage: storage });

// Upload a single file to Cloudinary
export const uploadToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Check if file is a buffer or has a path property
    if (file.buffer) {
      // Upload from buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'carecorner',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        
        uploadStream.end(file.buffer);
      });
      return result;
    } else if (file.path) {
      // Upload from file path
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'carecorner',
        resource_type: 'auto',
      });
      return result;
    } else {
      throw new Error('Invalid file format');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

// Delete a file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error('No public ID provided');
    }
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};

// Get public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const matches = url.match(/\/v\d+\/([^/]+)\.\w+$/);
  return matches ? matches[1] : null;
}; 