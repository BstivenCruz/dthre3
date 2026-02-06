export type UserRole = "admin" | "recepcionista" | "estudiante";
export type StudentType = "new" | "regular" | "crew";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  studentType: StudentType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Respuesta completa (incluye auth solo para backend)
export interface UserResponse {
  user: User;
  auth: {
    passwordHash: string;
  };
}
