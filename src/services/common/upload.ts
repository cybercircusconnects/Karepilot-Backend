import cloudinary from "../../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  fileType?: string;
  fileName?: string;
}

export class UploadService {
  private readonly allowedMimeTypes = {
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/gif": true,
    "image/webp": true,
    "image/svg+xml": true,
    "image/bmp": true,
    "image/tiff": true,
    "application/pdf": true,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true, 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true, 
    "application/vnd.ms-excel": true, 
    "application/vnd.ms-word": true, 
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": true, 
    
    "text/plain": true,
    "text/csv": true,
  };

  private isFileTypeAllowed(mimetype: string): boolean {
    return this.allowedMimeTypes[mimetype as keyof typeof this.allowedMimeTypes] || false;
  }

  async uploadFile( 
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<UploadResult> {
    try {
      if (!this.isFileTypeAllowed(file.mimetype)) {
        return {
          success: false,
          error: `File type ${file.mimetype} is not allowed`,
        };
      }

      const base64String = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      const isImage = file.mimetype.startsWith("image/");
      const resourceType = isImage ? "image" : "raw";

      const uploadOptions: any = {
        folder,
        resource_type: resourceType,
      };

      if (isImage) {
        uploadOptions.transformation = [
          { quality: "auto", fetch_format: "auto" },
        ];
      }

      const result: UploadApiResponse = await cloudinary.uploader.upload(
        base64String,
        uploadOptions
      );

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        fileType: file.mimetype,
        fileName: file.originalname,
      };
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload file",
      };
    }
  }

  async deleteFile(publicId: string, resourceType: string = "image"): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return true;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      return false;
    }
  }

  extractPublicIdFromUrl(url: string): string | null {
    try {
      const parts = url.split("/");
      const filename = parts.length > 0 ? parts[parts.length - 1] : undefined;
      if (!filename) return null;
      const publicId = filename.split(".")[0];
      return publicId || null;
    } catch (error) {
      return null;
    }
  }

  getFileCategory(mimetype: string): "image" | "document" | "unknown" {
    if (mimetype.startsWith("image/")) return "image";
    if (
      mimetype.includes("pdf") ||
      mimetype.includes("word") ||
      mimetype.includes("excel") ||
      mimetype.includes("presentation") ||
      mimetype.includes("text")
    ) {
      return "document";
    }
    return "unknown";
  }
}

export default new UploadService();

