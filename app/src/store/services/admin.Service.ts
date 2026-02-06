import { apiInstance } from "@/utils/api";
import type { IDataResponse } from "@/interfaces/dataResponse";
import type { AdminDashboardData } from "../interfaces/admin";

export const getAdminStats = async (): Promise<
  IDataResponse<AdminDashboardData>
> => {
  try {
    // TODO: Reemplazar con endpoint real cuando esté disponible
    // Por ahora retornamos datos mock
    const mockData: AdminDashboardData = {
      stats: {
        revenue: {
          totalMonth: 120000.00,
          growthPercentage: 0, // null se convierte a 0
          pendingPayments: 0,
        },
        students: {
          totalActive: 1,
          newThisMonth: 1,
          atRiskOfChurn: 0,
        },
        occupancy: {
          averagePercentage: 0.00,
          mostPopularClass: "Salsa Intermedio",
        },
      },
      daily: {
        todayAttendances: 0,
        upcomingClasses: [
          {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            capacity: 30,
            roomName: "Sala A",
            className: "Salsa Intermedio",
            startTime: "18:00",
            teacherName: "Profesor Uno",
            enrolledCount: 0,
          },
          {
            id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            capacity: 20,
            roomName: "Sala B",
            className: "Bachata Básico",
            startTime: "19:30",
            teacherName: "Profesor Uno",
            enrolledCount: 0,
          },
        ],
        recentPayments: [
          {
            id: "55556666-7777-8888-9999-000011112222",
            amount: 120000.00,
            method: "efectivo",
            status: "completado",
            studentName: "Estudiante Uno",
          },
        ],
      },
      charts: {
        revenueHistory: [
          {
            date: "2026-01",
            amount: 120000.00,
          },
        ],
        attendanceByStyle: [
          {
            count: 1,
            style: "Salsa",
          },
          {
            count: 1,
            style: "Bachata",
          },
        ],
        studentGrowth: [
          {
            count: 1,
            month: "2026-01",
          },
        ],
      },
      topTeachers: [
        {
          id: "88888888-8888-8888-8888-888888888888",
          name: "Profesor Uno",
          totalClasses: 2,
          averageAttendance: 1.00,
        },
      ],
      lowOccupancyClasses: [
        {
          id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          name: "Salsa Intermedio",
          style: "Salsa",
          totalAttendances: 1,
          revenueGenerated: 120000.00,
        },
        {
          id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          name: "Bachata Básico",
          style: "Bachata",
          totalAttendances: 1,
          revenueGenerated: 120000.00,
        },
      ],
    };
    
    return { success: true, data: mockData, error: null };
    
    // Cuando el endpoint esté disponible, descomentar esto:
    // const { data } = await apiInstance.get(`/admin/dashboard`);
    // return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};
