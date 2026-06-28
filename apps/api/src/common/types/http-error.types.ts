/**
 * Mirrors `@caffeapp/shared` ApiErrorDto — keep in sync with contracts package.
 */
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  error?: string;
}
