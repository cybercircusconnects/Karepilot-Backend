import cloudinary from '../../config/cloudinaryConfig';
import { UploadApiResponse } from 'cloudinary';

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export const uploadImage = async (
  file: Express.Multer.File,
  folder: string = 'profile-images'
): Promise<UploadResult> => {
  try {
    const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const result: UploadApiResponse = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
};

export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const filename = parts.length > 0 ? parts[parts.length - 1] : undefined;
    if (!filename) return null;
    const publicId = filename.split('.')[0];
    return publicId || null;
  } catch (error) {
    return null;
  }
};
