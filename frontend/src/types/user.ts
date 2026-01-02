// src/types/user.ts
export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  avatar_color?: string;

}
