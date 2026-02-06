export interface AdminDashboardData {
  stats: AdminStats;
  daily: DailyOverview;
  charts: {
    revenueHistory: { date: string; amount: number }[]; // Para gráfica de líneas
    attendanceByStyle: { style: string; count: number }[]; // Para gráfica de pastel
    studentGrowth: { month: string; count: number }[]; // Para gráfica de barras
  };
  topTeachers: TeacherPerformance[];
  lowOccupancyClasses: ClassAnalytics[]; // Clases que necesitan promoción
}

export interface TeacherPerformance {
  id: string;
  name: string;
  totalClasses: number;
  averageAttendance: number;
  rating?: number; // Si decides agregar feedback después
}

export interface ClassAnalytics {
  id: string;
  name: string;
  style: string;
  totalAttendances: number;
  revenueGenerated: number;
}

export interface DailyOverview {
  todayAttendances: number;
  upcomingClasses: {
    id: string;
    className: string;
    startTime: string;
    teacherName: string;
    roomName: string;
    enrolledCount: number;
    capacity: number;
  }[];
  recentPayments: {
    id: string;
    studentName: string;
    amount: number;
    method: string;
    status: string;
  }[];
}

export interface AdminStats {
  revenue: {
    totalMonth: number;
    growthPercentage: number; // Comparado con mes anterior
    pendingPayments: number;
  };
  students: {
    totalActive: number;
    newThisMonth: number;
    atRiskOfChurn: number; // Estudiantes con paquete por vencer o sin créditos
  };
  occupancy: {
    averagePercentage: number;
    mostPopularClass: string;
  };
}
