"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  CreditCard,
  Calendar as CalendarIcon,
  Loader2,
  Clock,
  TrendingDown,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useAuth, useRecord } from "@/store/hooks";
import { formatDate, formatCurrency, parseDate } from "@/lib/utils";

const Record = () => {
  const { recordData, isLoading, getRecordDataByUserId } = useRecord();
  const { user } = useAuth();
  const [tab, setTab] = useState<"asistencias" | "pagos" | "paquetes">(
    "asistencias"
  );

  useEffect(() => {
    if (user?.id) {
      getRecordDataByUserId(user.id);
    }
  }, [getRecordDataByUserId, user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const attendances = recordData?.attendances ?? [];
  const payments = recordData?.payments ?? [];
  const packages = recordData?.packages ?? [];

  // Ordenar asistencias por fecha más reciente
  const sortedAttendances = [...attendances].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Ordenar pagos por fecha más reciente
  const sortedPayments = [...payments].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Ordenar paquetes por fecha de validez (más reciente primero)
  const sortedPackages = [...packages].sort((a, b) => {
    return new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Historial</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Tu actividad completa en D-thre3
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "asistencias" | "pagos" | "paquetes")}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="asistencias" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Asistencias
            {attendances.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {attendances.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pagos" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos
            {payments.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {payments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paquetes" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Paquetes
            {packages.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {packages.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab Asistencias */}
        <TabsContent value="asistencias" className="mt-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Historial de Asistencias
                {attendances.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {attendances.length} {attendances.length === 1 ? 'asistencia' : 'asistencias'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attendances.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Sin asistencias registradas
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Tus asistencias aparecerán aquí
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {sortedAttendances.map((a, index) => {
                      const creditsUsed = a.creditsUsed ?? 1;
                      return (
                        <HoverCard key={a.id}>
                          <HoverCardTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-muted/70 transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                                  style={{
                                    backgroundColor:
                                      a.class?.style?.color ?? "#D10000",
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
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-muted-foreground">
                                      {a.class?.style?.name ?? "Clase general"}
                                    </p>
                                    {a.entryMethod && (
                                      <>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <Badge variant="outline" className="text-xs">
                                          {a.entryMethod === 'nfc' ? 'NFC' : a.entryMethod === 'manual' ? 'Manual' : a.entryMethod}
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-4">
                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
                                  <span>{formatDate(a.date)}</span>
                                </div>
                              </div>
                            </motion.div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-sm">
                                  {a.class?.name ?? "Clase"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {a.class?.style?.name ?? "Clase general"}
                                </p>
                              </div>
                              <Separator />
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <TrendingDown className="h-4 w-4 text-destructive" />
                                  <span className="text-muted-foreground">
                                    Créditos gastados:
                                  </span>
                                  <span className="font-semibold text-destructive">
                                    {creditsUsed}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Fecha:</span>
                                  <span>{formatDate(a.date)}</span>
                                </div>
                                {a.entryMethod && (
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Método:</span>
                                    <Badge variant="outline" className="text-xs">
                                      {a.entryMethod === 'nfc' ? 'NFC' : a.entryMethod === 'manual' ? 'Manual' : a.entryMethod}
                                    </Badge>
                                  </div>
                                )}
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
        </TabsContent>

        {/* Tab Pagos */}
        <TabsContent value="pagos" className="mt-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="h-5 w-5 text-primary" />
                Historial de Pagos
                {payments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Sin pagos registrados
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Tu historial de pagos aparecerá aquí
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {sortedPayments.map((p, index) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-muted/70 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {formatCurrency(Number(p.amount))}
                              </p>
                              <Badge
                                variant={
                                  p.status === "completado"
                                    ? "success"
                                    : "warning"
                                }
                                className="text-xs"
                              >
                                {p.status === "completado" ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {p.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-muted-foreground">
                                {p.method}
                              </p>
                              {p.receiptNumber && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <p className="text-xs text-muted-foreground">
                                    Recibo: {p.receiptNumber}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>{formatDate(p.createdAt)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Paquetes */}
        <TabsContent value="paquetes" className="mt-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5 text-primary" />
                Historial de Paquetes
                {packages.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {packages.length} {packages.length === 1 ? 'paquete' : 'paquetes'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {packages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground font-medium">
                    Sin paquetes registrados
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Tu historial de paquetes aparecerá aquí
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {sortedPackages.map((pkg, index) => {
                      // Parsear correctamente la fecha de validUntil
                      const validUntilDate = parseDate(pkg.validUntil);
                      const now = new Date();
                      
                      // El paquete está activo si:
                      // 1. isActive es true
                      // 2. La fecha de validUntil es válida
                      // 3. La fecha de validUntil es mayor o igual a hoy
                      const isActive =
                        pkg.isActive &&
                        validUntilDate !== null &&
                        validUntilDate >= now;
                      
                      const totalCredits = pkg.package?.credits ?? 0;
                      const usedCredits = totalCredits - pkg.creditsRemaining;
                      const usagePercentage =
                        totalCredits > 0
                          ? (usedCredits / totalCredits) * 100
                          : 0;

                      return (
                        <HoverCard key={pkg.id}>
                          <HoverCardTrigger asChild>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`group flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? "bg-gradient-to-r from-primary/5 to-transparent border-primary/20 hover:border-primary/30"
                                  : "bg-muted/50 border-border hover:border-primary/20 hover:bg-muted/70"
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isActive
                                      ? "bg-primary/10"
                                      : "bg-muted"
                                  }`}
                                >
                                  <Package
                                    className={`h-5 w-5 ${
                                      isActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                                      {pkg.package?.name ?? "Paquete"}
                                    </p>
                                    <Badge
                                      variant={isActive ? "success" : "secondary"}
                                      className="text-xs"
                                    >
                                      {isActive ? (
                                        <>
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          Activo
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="h-3 w-3 mr-1" />
                                          Expirado
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                  {pkg.package?.isUnlimited ? (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Ilimitado
                                    </p>
                                  ) : (
                                    <div className="space-y-2 mt-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                          Créditos
                                        </span>
                                        <span className="font-semibold">
                                          {pkg.creditsRemaining} / {totalCredits}
                                        </span>
                                      </div>
                                      {totalCredits > 0 && (
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${usagePercentage}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-4">
                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
                                  <span>{formatDate(pkg.validUntil)}</span>
                                </div>
                                {!pkg.package?.isUnlimited && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {usedCredits} usado{usedCredits !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-sm">
                                  {pkg.package?.name ?? "Paquete"}
                                </p>
                                <Badge
                                  variant={isActive ? "success" : "secondary"}
                                  className="mt-1.5 text-xs"
                                >
                                  {isActive ? "Activo" : "Expirado"}
                                </Badge>
                              </div>
                              <Separator />
                              <div className="space-y-2 text-sm">
                                {pkg.package?.isUnlimited ? (
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      Tipo:
                                    </span>
                                    <span className="font-semibold">Ilimitado</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Créditos totales:
                                      </span>
                                      <span className="font-semibold">
                                        {totalCredits}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Usados:
                                      </span>
                                      <span className="font-semibold text-destructive">
                                        {usedCredits}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Restantes:
                                      </span>
                                      <span className="font-semibold text-primary">
                                        {pkg.creditsRemaining}
                                      </span>
                                    </div>
                                  </>
                                )}
                                <Separator />
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    Válido hasta:
                                  </span>
                                  <span>{formatDate(pkg.validUntil)}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Record;
