export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface SearchQuery {
  search?: string;
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailVerificationTemplate {
  fullName: string;
  verificationCode: string;
}

export interface EmailPasswordResetTemplate {
  fullName: string;
  resetCode: string;
}
