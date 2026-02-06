"use client";

import { useEffect, useMemo } from "react";
import {
  CreditCard,
  Flame,
  Calendar,
  Trophy,
  Loader2,
  AlertCircle,
  Clock,
  MapPin,
  User,
  TrendingDown,
  TrendingUp,
  Receipt,
  DollarSign,
} from "lucide-react";

import { DashboardCard } from "@/components/ui/dashboard-card";
import { DEFAULT_CLASS_COLOR } from "@/lib/design-tokens";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useAuth, useDashboard, useRecord } from "@/store/hooks";

import { formatDate, getDayName } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardData, isLoading, getDashboardDataByUserId } = useDashboard();
  const { recordData, getRecordDataByUserId } = useRecord();

  useEffect(() => {
    if (user?.id) {
      getDashboardDataByUserId(user.id);
      getRecordDataByUserId(user.id);
    }
  }, [getDashboardDataByUserId, getRecordDataByUserId, user?.id]);

  const recentAttendancesMemo = useMemo(
    () => dashboardData?.recentAttendances ?? [],
    [dashboardData?.recentAttendances]
  );
  const activePackageMemo = useMemo(
    () => dashboardData?.activePackage,
    [dashboardData?.activePackage]
  );

  const creditsInfo = useMemo(() => {
    if (!activePackageMemo || activePackageMemo.isUnlimited) {
      return {
        total: null,
        spent: 0,
        remaining: null,
        spentThisMonth: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const attendancesThisMonth = recentAttendancesMemo.filter((attendance) => {
      const attendanceDate = new Date(attendance.date);
      return (
        attendanceDate.getMonth() === currentMonth &&
        attendanceDate.getFullYear() === currentYear
      );
    });

    // Sumar créditos usados de cada asistencia (cada asistencia = 1 crédito por defecto si no se especifica)
    const spentThisMonth = attendancesThisMonth.reduce((total, attendance) => {
      return total + (attendance.creditsUsed ?? 1);
    }, 0);
    
    const remaining = activePackageMemo.creditsRemaining;
    const total = spentThisMonth + remaining;

    return {
      total,
      spent: spentThisMonth,
      remaining,
      spentThisMonth,
    };
  }, [activePackageMemo, recentAttendancesMemo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePackage = dashboardData?.activePackage;
  const streak = dashboardData?.streak ?? { current: 0, max: 0 };
  const recentAttendances = dashboardData?.recentAttendances ?? [];
  const classes = dashboardData?.classes ?? [];
  const today = new Date().getDay();
  const todayClasses = classes.filter((c) =>
    c.schedules?.some((s) => s.dayOfWeek === today)
  );

  const firstName = user?.name ?? "Estudiante";

  // Obtener asistencias con créditos gastados del record
  const attendancesWithCredits = recordData?.attendances ?? [];
  
  // Ordenar por fecha más reciente
  const sortedAttendancesWithCredits = [...attendancesWithCredits].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Calcular créditos totales del paquete actual (sumando gastados + restantes)
  const totalPackageCredits = activePackage && !activePackage.isUnlimited
    ? creditsInfo.total
    : null;

  const creditsProgress =
    activePackage && !activePackage.isUnlimited && creditsInfo.total
      ? Math.min(100, (creditsInfo.remaining / creditsInfo.total) * 100)
      : undefined;

  const streakProgress =
    streak.max > 0
      ? Math.min(100, (streak.current / streak.max) * 100)
      : streak.current > 0
      ? 20
      : 0;

  const lowCredits = activePackage
    ? !activePackage.isUnlimited && activePackage.creditsRemaining <= 3
    : false;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          Hola, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-muted-foreground text-lg">Tu progreso en D-thre3</p>
      </div>

      {lowCredits && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atención: Créditos bajos</AlertTitle>
          <AlertDescription>
            Te quedan solo {activePackage?.creditsRemaining} crédito
            {activePackage?.creditsRemaining !== 1 ? "s" : ""}. Considera
            renovar tu paquete pronto.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Créditos"
          value={
            activePackage?.isUnlimited
              ? "∞"
              : activePackage?.creditsRemaining ?? 0
          }
          subtitle={
            activePackage
              ? `Paquete: ${activePackage.name}`
              : "Sin paquete activo"
          }
          icon={CreditCard}
          color="primary"
          progress={creditsProgress}
        />
        <DashboardCard
          title="Racha Actual"
          value={streak.current}
          subtitle={`Meta: ${streak.max > 0 ? streak.max : "5"} días`}
          icon={Flame}
          color="warning"
          progress={streakProgress}
        />
        <DashboardCard
          title="Racha Máxima"
          value={streak.max}
          subtitle="Tu mejor marca"
          icon={Trophy}
          color="success"
        />
        <DashboardCard
          title="Clases Hoy"
          value={todayClasses.length}
          subtitle={getDayName(today)}
          icon={Calendar}
          color="info"
        />
      </div>

      {activePackage && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Paquete Activo
                  </p>
                </div>
                <h3 className="text-2xl font-bold">{activePackage.name}</h3>

                {activePackage.isUnlimited ? (
                  <Badge
                    variant="success"
                    className="text-sm px-3 py-1.5 w-fit"
                  >
                    Ilimitado
                  </Badge>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span>Total</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                          {creditsInfo.total ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          total del paquete
                        </p>
                      </div>

                      <div className="text-center space-y-1 border-x border-border/50">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                          <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                          <span>Gastados</span>
                        </div>
                        <p className="text-2xl font-bold text-destructive">
                          {creditsInfo.spent}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          este mes
                        </p>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5 text-primary" />
                          <span>Restantes</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          {creditsInfo.remaining ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          disponibles
                        </p>
                      </div>
                    </div>

                    {creditsProgress !== undefined &&
                      creditsInfo.total &&
                      creditsInfo.total > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progreso de créditos
                            </span>
                            <span className="font-semibold text-foreground">
                              {creditsInfo.remaining} / {creditsInfo.total}
                            </span>
                          </div>
                          <Progress value={creditsProgress} className="h-3" />
                          <p className="text-xs text-muted-foreground text-center">
                            {creditsInfo.spent} crédito
                            {creditsInfo.spent !== 1 ? "s" : ""} gastado
                            {creditsInfo.spent !== 1 ? "s" : ""} este mes
                          </p>
                        </div>
                      )}
                  </div>
                )}

                <Separator />

                <div className="flex items-center gap-2 pt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Válido hasta:{" "}
                    <span className="text-foreground font-medium">
                      {formatDate(activePackage.validUntil)}
                    </span>
                  </p>
                </div>
              </div>

              {activePackage.isUnlimited && (
                <Badge variant="success" className="text-sm px-4 py-2">
                  Ilimitado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-primary" />
              Clases de Hoy
              {todayClasses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {todayClasses.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No hay clases programadas para hoy
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  ¡Disfruta tu día libre!
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {todayClasses.map((c, index) => {
                    const schedule = c.schedules?.find(
                      (s) => s.dayOfWeek === today
                    );
                    return (
                      <HoverCard key={c.id}>
                        <HoverCardTrigger asChild>
                          <div
                            className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-muted/70 transition-all duration-200 cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                                style={{
                                  backgroundColor: c.style?.color ?? DEFAULT_CLASS_COLOR,
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                  {c.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <User className="h-3 w-3 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground truncate">
                                    {c.teacher?.name ?? "Sin profesor"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                <span>
                                  {schedule?.startTime} - {schedule?.endTime}
                                </span>
                              </div>
                              {c.room?.name && (
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{c.room.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <div>
                              <p className="font-semibold text-sm">{c.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Clase general
                              </p>
                            </div>
                            <Separator />
                            <div className="space-y-1.5 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Profesor:
                                </span>
                                <span>{c.teacher?.name ?? "No asignado"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Salón:
                                </span>
                                <span>{c.room?.name ?? "No asignado"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Horario:
                                </span>
                                <span>
                                  {schedule?.startTime} - {schedule?.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-5 w-5 text-primary" />
              Últimas Asistencias
              {recentAttendances.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {recentAttendances.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAttendances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  Sin asistencias recientes
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Tus asistencias aparecerán aquí
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {recentAttendances.slice(0, 10).map((a, index) => {
                    const creditsUsed = a.creditsUsed ?? 1;
                    return (
                      <div
                        key={a.id}
                        className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-muted/70 transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                            style={{
                              backgroundColor: a.class?.style?.color ?? DEFAULT_CLASS_COLOR,
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                {a.class?.name ?? "Clase"}
                              </p>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {creditsUsed} crédito{creditsUsed !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Clase general
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>{formatDate(a.date)}</span>
                          </div>
                          <Badge variant="outline" className="mt-1.5 text-xs">
                            Asistió
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historial de Gastos de Créditos */}
      {activePackage && !activePackage.isUnlimited && (
        <Card className="transition-all duration-150 hover:shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Receipt className="h-5 w-5 text-primary" />
              Historial de Gastos de Créditos
              {sortedAttendancesWithCredits.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {sortedAttendancesWithCredits.length} {sortedAttendancesWithCredits.length === 1 ? 'gasto' : 'gastos'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedAttendancesWithCredits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">
                  Sin gastos registrados
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Tus gastos de créditos aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      <span>Total Comprado</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {totalPackageCredits ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">créditos del paquete</p>
                  </div>
                  
                  <div className="text-center space-y-1 border-x border-border/50">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Receipt className="h-3.5 w-3.5 text-destructive" />
                      <span>Total Gastado</span>
                    </div>
                    <p className="text-2xl font-bold text-destructive">
                      {sortedAttendancesWithCredits.reduce((sum, a) => sum + (a.creditsUsed || 1), 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">créditos utilizados</p>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5 text-green-500" />
                      <span>Disponibles</span>
                    </div>
                    <p className="text-2xl font-bold text-green-500">
                      {creditsInfo.remaining ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">créditos restantes</p>
                  </div>
                </div>

                <Separator />

                {/* Lista de gastos */}
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {sortedAttendancesWithCredits.map((attendance, index) => {
                      const creditsUsed = attendance.creditsUsed || 1;
                      const percentageOfTotal = totalPackageCredits 
                        ? ((creditsUsed / totalPackageCredits) * 100).toFixed(1)
                        : '0';
                      
                      return (
                        <div
                          key={attendance.id}
                          className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-muted/70 transition-all duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                              style={{
                                backgroundColor: attendance.class?.style?.color ?? DEFAULT_CLASS_COLOR,
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                  {attendance.class?.name ?? "Clase"}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {creditsUsed} crédito{creditsUsed !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(attendance.date)}
                                </p>
                                {totalPackageCredits && (
                                  <>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <p className="text-xs text-muted-foreground">
                                      {percentageOfTotal}% del total
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                              <TrendingDown className="h-4 w-4" />
                              <span>-{creditsUsed}</span>
                            </div>
                            {attendance.entryMethod && (
                              <Badge variant="outline" className="mt-1.5 text-xs">
                                {attendance.entryMethod}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
