export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export interface ErrorResponse {
  message: string;
  error: unknown;
}
