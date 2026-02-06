import { UserRole } from "./user";

export interface JWTResponse {
  userId: string;
  email: string;
  role: UserRole;
}
