import { Request, Response } from "express";
import { uploadService } from "../../services/common";

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    const folder = (req.body.folder as string) || "uploads";
    const result = await uploadService.uploadFile(req.file, folder);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.error || "Failed to upload file",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.url,
        publicId: result.publicId,
        fileType: result.fileType,
        fileName: result.fileName,
        category: uploadService.getFileCategory(result.fileType || ""),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const publicId = req.params[0];
    const { resourceType } = req.query;

    if (!publicId) {
      res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
      return;
    }

    const decodedPublicId = decodeURIComponent(publicId);

    const result = await uploadService.deleteFile(
      decodedPublicId,
      (resourceType as string) || "image"
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Failed to delete file",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete file",
    });
  }
};

