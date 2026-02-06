/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IDataResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string | null;
}
