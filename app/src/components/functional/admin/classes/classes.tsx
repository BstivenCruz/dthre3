"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Calendar as CalendarIcon,
    Clock,
    Edit,
    Loader2,
    MapPin,
    Plus,
    Search,
    User,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { getDayName } from "@/lib/utils";

import { useClasses } from "@/store/hooks";
import type { AdminClassManagement } from "@/store/interfaces/classes";

const levelLabels: Record<AdminClassManagement["level"], string> = {
    iniciacion: "Iniciación",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    open: "Open",
};

const Classes = () => {
    const { classesData, isLoading, error, getAllClasses } = useClasses();

    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
    const [query, setQuery] = useState("");

    useEffect(() => {
        getAllClasses();
    }, [getAllClasses]);

    const classes = useMemo(() => classesData?.classes ?? [], [classesData?.classes]);

    const filteredClasses = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return classes.filter((c) => {
            const matchesQuery =
                !normalizedQuery || c.name.toLowerCase().includes(normalizedQuery);
            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "active"
                        ? c.isActive
                        : !c.isActive;

            return matchesQuery && matchesFilter;
        });
    }, [classes, filter, query]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Gestión de <span className="gradient-text">Clases</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Administra, busca y revisa la programación de clases
                    </p>
                </div>

                <Link href="/admin/classes/new" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva clase
                    </Button>
                </Link>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Clases
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Visualiza las clases registradas y sus horarios
                            </CardDescription>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-[320px]">
                                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="pl-9"
                                />
                            </div>
                            <Tabs
                                value={filter}
                                onValueChange={(v) => setFilter(v as typeof filter)}
                                className="w-full sm:w-auto"
                            >
                                <TabsList className="grid w-full grid-cols-3 sm:w-[320px]">
                                    <TabsTrigger value="all">Todas</TabsTrigger>
                                    <TabsTrigger value="active">Activas</TabsTrigger>
                                    <TabsTrigger value="inactive">Inactivas</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Separator className="mb-6" />
                    {filteredClasses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">
                                No hay clases para mostrar
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Ajusta el filtro o el buscador para ver resultados
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredClasses.map((c: AdminClassManagement, idx) => {
                                const activeSchedules = c.schedules.filter((s) => s.isActive);

                                return (
                                    <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all duration-300"
                                        style={{
                                            borderLeftWidth: 4,
                                            borderLeftColor: c.color ?? c.style?.color ?? "#D10000",
                                        }}
                                    >
                                        <div className="p-5 space-y-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-base truncate">
                                                        {c.name}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {levelLabels[c.level]}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {c.style.name}
                                                        </Badge>
                                                        <Badge
                                                            variant={c.isActive ? "default" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {c.isActive ? "Activa" : "Inactiva"}
                                                        </Badge>
                                                        {c.isSpecial && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Especial
                                                            </Badge>
                                                        )}
                                                        <Badge variant="secondary" className="text-xs">
                                                            Cupo: {c.maxCapacity}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            Créditos: {c.creditCost}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            Ocupación: {Math.round(c.metrics.occupancyPercentage)}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User className="h-4 w-4 text-primary" />
                                                    <span className="truncate">{c.teacher.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <span className="truncate">{c.room.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span>
                                                        {activeSchedules.length > 0
                                                            ? `${activeSchedules.length} horario(s)`
                                                            : "Sin horarios activos"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Link href={`/admin/classes/${c.id}`}>
                                                    <Button variant="outline" className="w-full">
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Button>
                                                </Link>

                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Button variant="outline">Horarios</Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80">
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="font-semibold text-sm">{c.name}</p>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {c.isActive ? "Activa" : "Inactiva"}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {levelLabels[c.level]}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {c.style.name}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <Separator />

                                                            {activeSchedules.length === 0 ? (
                                                                <p className="text-sm text-muted-foreground">
                                                                    Esta clase no tiene horarios activos.
                                                                </p>
                                                            ) : (
                                                                <div className="space-y-2 text-sm">
                                                                    {activeSchedules.map((s) => (
                                                                        <div
                                                                            key={s.id}
                                                                            className="flex items-center justify-between gap-3"
                                                                        >
                                                                            <span className="text-muted-foreground">
                                                                                {getDayName(s.dayOfWeek)}
                                                                            </span>
                                                                            <span className="font-medium">
                                                                                {s.startTime} - {s.endTime}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Classes