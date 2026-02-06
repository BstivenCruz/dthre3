export interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
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

export interface CalendarClass {
  id: string;
  name: string;
  level?: string;
  style?: ClassStyle;
  teacher?: Teacher;
  room?: Room;
  schedules?: Schedule[];
}

export interface CalendarData {
  classes: CalendarClass[];
}
