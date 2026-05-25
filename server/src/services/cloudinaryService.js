import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export async function uploadImage(filePath, folder = 'nutricare') {
  if (!env.cloudinary.cloudName) {
    return {
      publicId: 'development/mock-image',
      secureUrl: filePath,
      mode: 'mock',
    };
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
  };
}

