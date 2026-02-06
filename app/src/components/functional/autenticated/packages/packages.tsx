"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CreditCard,
  Infinity,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { useAuth, usePackages } from "@/store/hooks";
import type { Package as PackageType } from "@/store/interfaces/packages";

import { formatCurrency, formatDate, parseDate, cn } from "@/lib/utils";

const Packages = () => {
  const { packages, isLoading, getPackagesByUserId } = usePackages();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      getPackagesByUserId(user.id);
    }
  }, [getPackagesByUserId, user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activePackage = packages?.activePackage;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Paquetes Disponibles</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Elige el paquete que mejor se adapte a tus necesidades
        </p>
      </div>

      {/* Paquete Activo */}
      {activePackage && (
        <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-transparent transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span>Paquete Activo</span>
              <Badge variant="success" className="ml-auto">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Activo
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">
                    {activePackage.name}
                  </h3>
                  {activePackage.isUnlimited && (
                    <Infinity className="h-6 w-6 text-primary" />
                  )}
                </div>
                {activePackage.isUnlimited ? (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Créditos ilimitados
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Créditos restantes:</span>
                      <span className="font-semibold text-lg text-primary">
                        {activePackage.creditsRemaining}
                      </span>
                    </div>
                    <Progress
                      value={(activePackage.creditsRemaining / 100) * 100}
                      className="h-2"
                    />
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Válido hasta:</span>
                <span className="font-medium">
                  {formatDate(activePackage.validUntil)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Paquetes */}
      {packages?.packages.length === 0 ? (
        <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium text-lg">
                No hay paquetes disponibles en este momento
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Vuelve pronto para ver nuevas opciones
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages?.packages.map((pkg: PackageType, i: number) => {
            const isActivePackage = packages.activePackage?.id === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={cn(
                    "h-full flex flex-col group transition-all duration-300",
                    isActivePackage
                      ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-lg shadow-primary/10"
                      : "hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200",
                            isActivePackage
                              ? "bg-primary/10 group-hover:bg-primary/20"
                              : "bg-muted group-hover:bg-primary/10"
                          )}
                        >
                          {pkg.isUnlimited ? (
                            <Infinity className="h-6 w-6 text-primary" />
                          ) : (
                            <CreditCard className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold leading-tight">
                          {pkg.name}
                        </CardTitle>
                      </div>
                      {isActivePackage && (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Activo
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col space-y-4">
                    {pkg.description && (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pkg.description}
                        </p>
                        <Separator />
                      </>
                    )}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          {pkg.isUnlimited ? (
                            <Sparkles className="h-4 w-4 text-primary" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-primary" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            Créditos:
                          </span>
                        </div>
                        <span className="font-bold text-lg">
                          {pkg.isUnlimited ? (
                            <span className="flex items-center gap-1">
                              <Infinity className="h-5 w-5 text-primary" />
                              Ilimitados
                            </span>
                          ) : (
                            pkg.credits
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Duración:
                          </span>
                        </div>
                        <span className="font-semibold">
                          {pkg.durationDays} día{pkg.durationDays !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span className="text-sm text-muted-foreground font-medium">
                          Precio:
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(pkg.price)}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-auto transition-all duration-200"
                      variant={
                        isActivePackage
                          ? "outline"
                          : pkg.isActive
                          ? "default"
                          : "secondary"
                      }
                      disabled={isActivePackage || !pkg.isActive}
                    >
                      {isActivePackage ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Paquete Activo
                        </>
                      ) : !pkg.isActive ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          No Disponible
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Seleccionar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Packages;
