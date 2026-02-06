export interface ActivePackage {
  id: string;
  name: string;
  creditsRemaining: number;
  isUnlimited: boolean;
  validUntil: string;
}

export interface Streak {
  current: number;
  max: number;
}

export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ClassStyle {
  color: string;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  style?: ClassStyle;
  teacher?: Teacher;
  room?: Room;
  schedules?: Schedule[];
}

export interface Attendance {
  id: string;
  date: string;
  creditsUsed?: number;
  entryMethod?: string;
  class?: Class;
}

export interface DashboardData {
  activePackage: ActivePackage | null;
  streak: Streak;
  recentAttendances: Attendance[];
  classes: Class[];
}
