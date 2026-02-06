export interface ClassTeacher {
  id: string;
  name: string;
  photo?: string | null;
}

export interface ClassRoom {
  id: string;
  name: string;
  capacity: number;
}

export interface ClassStyle {
  id: string;
  name: string;
  color: string;
}

export interface ClassSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}


export interface AdminClassManagement {
  id: string;
  name: string;
  description?: string | null;
  level: 'iniciacion' | 'intermedio' | 'avanzado' | 'open';
  creditCost: number;
  maxCapacity: number;
  isSpecial: boolean;
  isActive: boolean;
  color?: string | null;

  style: ClassStyle;
  teacher: ClassTeacher;
  room: ClassRoom;

  schedules: ClassSchedule[];

  metrics: {
    enrolledCount: number;
    occupancyPercentage: number;
    totalAttendancesAllTime: number;
  };

  createdAt: string;
  updatedAt: string;
}

export interface SaveClassRequest {
  id?: string;
  name: string;
  description?: string;
  styleId: string;
  teacherId: string;
  roomId: string;
  level: string;
  creditCost: number;
  maxCapacity: number;
  isSpecial: boolean;
  isActive: boolean;
  color?: string | null;
  schedules: Omit<ClassSchedule, 'id'>[];
}

export interface ClassesData {
  classes: AdminClassManagement[];
}