export type StudentType = "new" | "regular" | "crew";

export interface StudentProfile {
  id: string;
  user_id: string;
  student_type: StudentType;
  current_streak: number;
  longest_streak: number;
  last_attendance_date?: Date;
  referral_code?: string;
  referred_by_code?: string;
  created_at: Date;
  updated_at: Date;
}
