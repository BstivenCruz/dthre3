"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  Loader2,
  BookOpen,
  FileText,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  UserPlus,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { DashboardCard } from "@/components/ui/dashboard-card";
import { CHART_COLORS } from "@/lib/design-tokens";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

import { useAdmin } from "@/store/hooks";

const DashboardAdmin = () => {
  const { adminDashboardData, isLoading, getAdminStats } = useAdmin();

  useEffect(() => {
    getAdminStats();
  }, [getAdminStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = adminDashboardData?.stats;
  const daily = adminDashboardData?.daily;
  const topTeachers = adminDashboardData?.topTeachers ?? [];
  const lowOccupancyClasses = adminDashboardData?.lowOccupancyClasses ?? [];

  const revenueGrowth = stats?.revenue.growthPercentage ?? 0;
  const isRevenuePositive = revenueGrowth >= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          Panel de <span className="gradient-text">Administración</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Resumen general de D-thre3
        </p>
      </div>

      {/* Métricas Principales - Revenue */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Ingresos del Mes"
          value={formatCurrency(stats?.revenue.totalMonth ?? 0)}
          subtitle={
            isRevenuePositive
              ? `↑ ${Math.abs(revenueGrowth).toFixed(1)}% vs mes anterior`
              : `↓ ${Math.abs(revenueGrowth).toFixed(1)}% vs mes anterior`
          }
          icon={CreditCard}
          color="success"
        />
        <DashboardCard
          title="Pagos Pendientes"
          value={formatCurrency(stats?.revenue.pendingPayments ?? 0)}
          subtitle="Por recibir"
          icon={Clock}
          color="warning"
        />
        <DashboardCard
          title="Estudiantes Activos"
          value={stats?.students.totalActive ?? 0}
          subtitle={`${stats?.students.newThisMonth ?? 0} nuevos este mes`}
          icon={Users}
          color="primary"
        />
      </div>

      {/* Métricas Secundarias */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Nuevos Este Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats?.students.newThisMonth ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estudiantes registrados
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              En Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">
              {stats?.students.atRiskOfChurn ?? 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Ocupación Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats?.occupancy?.averagePercentage?.toFixed(1) ?? "0"}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Clase más popular: {stats?.occupancy?.mostPopularClass || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección Principal: Clases Próximas, Pagos Recientes y Asistencias */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clases Próximas */}
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  Clases Próximas
                </CardTitle>
                <CardDescription className="mt-1">
                  Próximas clases programadas para hoy
                </CardDescription>
              </div>
              {daily?.upcomingClasses && daily.upcomingClasses.length > 0 && (
                <Badge variant="secondary">
                  {daily.upcomingClasses.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!daily?.upcomingClasses || daily.upcomingClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No hay clases próximas
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Las clases programadas aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {daily.upcomingClasses.slice(0, 5).map((classItem) => {
                  const occupancyPercentage =
                    (classItem.enrolledCount / classItem.capacity) * 100;
                  return (
                    <div
                      key={classItem.id}
                      className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/70 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {classItem.className}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {classItem.startTime}
                            </span>
                            <span>{classItem.teacherName}</span>
                            <span>{classItem.roomName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Ocupación: {classItem.enrolledCount}/
                            {classItem.capacity}
                          </span>
                          <span className="font-medium">
                            {occupancyPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={occupancyPercentage} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagos Recientes */}
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pagos Recientes
                </CardTitle>
                <CardDescription className="mt-1">
                  Últimos pagos registrados
                </CardDescription>
              </div>
              {daily?.recentPayments && daily.recentPayments.length > 0 && (
                <Badge variant="secondary">{daily.recentPayments.length}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!daily?.recentPayments || daily.recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  Sin pagos recientes
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Los pagos aparecerán aquí
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daily.recentPayments.slice(0, 5).map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.studentName}
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {payment.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {payment.status === "completed" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completado
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {daily?.recentPayments && daily.recentPayments.length > 5 && (
              <div className="mt-4 pt-4 border-t">
                <Link href="/admin/reportes">
                  <Button variant="outline" className="w-full" size="sm">
                    Ver Todos los Pagos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Teachers y Clases de Baja Ocupación */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Teachers */}
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Profesores
            </CardTitle>
            <CardDescription>Profesores con mejor desempeño</CardDescription>
          </CardHeader>
          <CardContent>
            {topTeachers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  Sin datos de profesores
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Los datos aparecerán aquí
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Clases</TableHead>
                    <TableHead>Asistencia Prom.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTeachers.slice(0, 5).map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.name}
                      </TableCell>
                      <TableCell>{teacher.totalClasses}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={teacher.averageAttendance}
                            className="h-2 w-20"
                          />
                          <span className="text-sm text-muted-foreground">
                            {teacher.averageAttendance.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Clases de Baja Ocupación */}
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Clases que Necesitan Promoción
            </CardTitle>
            <CardDescription>Clases con baja ocupación</CardDescription>
          </CardHeader>
          <CardContent>
            {lowOccupancyClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  Todas las clases están bien
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  No hay clases con baja ocupación
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clase</TableHead>
                    <TableHead>Estilo</TableHead>
                    <TableHead>Asistencias</TableHead>
                    <TableHead>Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowOccupancyClasses.slice(0, 5).map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">
                        {classItem.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {classItem.style}
                        </Badge>
                      </TableCell>
                      <TableCell>{classItem.totalAttendances}</TableCell>
                      <TableCell>
                        {formatCurrency(classItem.revenueGenerated)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      {adminDashboardData?.charts && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Historial de Ingresos */}
          <Card className="transition-all duration-150 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-primary" />
                Historial de Ingresos
              </CardTitle>
              <CardDescription>
                Evolución de los ingresos en el tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminDashboardData.charts.revenueHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Sin datos disponibles
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={adminDashboardData.charts.revenueHistory}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value) =>
                        formatCurrency(typeof value === "number" ? value : 0)
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      name="Ingresos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Asistencia por Estilo */}
          <Card className="transition-all duration-150 hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5 text-primary" />
                Asistencia por Estilo
              </CardTitle>
              <CardDescription>
                Distribución de asistencias por estilo de baile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminDashboardData.charts.attendanceByStyle.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Sin datos disponibles
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={adminDashboardData.charts.attendanceByStyle.map((item) => ({
                        name: item.style,
                        value: item.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={80}
                      fill={CHART_COLORS[0]}
                      dataKey="value"
                      nameKey="name"
                    >
                      {adminDashboardData.charts.attendanceByStyle.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Crecimiento de Estudiantes */}
          <Card className="transition-all duration-150 hover:shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserPlus className="h-5 w-5 text-primary" />
                Crecimiento de Estudiantes
              </CardTitle>
              <CardDescription>
                Nuevos estudiantes registrados por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminDashboardData.charts.studentGrowth.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Sin datos disponibles
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={adminDashboardData.charts.studentGrowth}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      name="Nuevos Estudiantes"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cards de Navegación */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/clases">
          <Card className="transition-all duration-150 hover:shadow-sm cursor-pointer border-primary/20 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Clases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gestionar Clases
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reportes">
          <Card className="transition-all duration-150 hover:shadow-sm cursor-pointer border-primary/20 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Reportes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Reportes
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/usuarios">
          <Card className="transition-all duration-150 hover:shadow-sm cursor-pointer border-primary/20 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gestionar
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/config">
          <Card className="transition-all duration-150 hover:shadow-sm cursor-pointer border-primary/20 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ajustes
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardAdmin;
