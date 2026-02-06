"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Loader2,
  Clock,
  MapPin,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

import { useAuth, useCalendar } from "@/store/hooks";
import type { CalendarClass } from "@/store/interfaces/calendar";

import { getDayName } from "@/lib/utils";

const Calendar = () => {
  const { calendarData, isLoading, getCalendarClassesByUserId } = useCalendar();
  const { user } = useAuth();
  const [view, setView] = useState<"week" | "day">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user?.id) {
      getCalendarClassesByUserId(user.id);
    }
  }, [getCalendarClassesByUserId, user?.id]);

  const classes = calendarData?.classes ?? [];

  const days =
    view === "week"
      ? Array.from({ length: 7 }, (_, i) => {
          const d = new Date(currentDate);
          d.setDate(d.getDate() - d.getDay() + i);
          return d;
        })
      : [currentDate];

  const getClassesForDay = (dayOfWeek: number) =>
    classes.filter((c) =>
      c.schedules?.some((s) => s.dayOfWeek === dayOfWeek && s.isActive)
    );

  const navigateDate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + delta * 7);
    } else {
      newDate.setDate(newDate.getDate() + delta);
    }
    setCurrentDate(newDate);
  };

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
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">Calendario</span> de Clases
        </h1>
        <p className="text-muted-foreground text-lg">
          Consulta los horarios disponibles
        </p>
      </div>

      {/* Tabs para cambiar vista */}
      <Tabs
        value={view}
        onValueChange={(value) => setView(value as "week" | "day")}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-[200px] grid-cols-2">
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="day">Día</TabsTrigger>
        </TabsList>
        {/* Contenido para vista Semana */}
        <TabsContent value="week" className="mt-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateDate(-1)}
                  className="hover:bg-primary/10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Semana del {days[0]?.toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                  })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateDate(1)}
                  className="hover:bg-primary/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-7">
                {days.map((day, idx) => {
                  const dayOfWeek = day.getDay();
                  const dayClasses = getClassesForDay(dayOfWeek);
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group p-4 rounded-lg border transition-all duration-300 ${
                        isToday
                          ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 shadow-md shadow-primary/20"
                          : "border-border bg-muted/30 hover:border-primary/20 hover:bg-muted/50"
                      }`}
                    >
                      <div className="text-center mb-4">
                        <p
                          className={`text-sm font-semibold mb-1 ${
                            isToday ? "text-primary" : ""
                          }`}
                        >
                          {getDayName(dayOfWeek)}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            isToday
                              ? "text-primary/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          {day.toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      <div className="space-y-2 min-h-[120px]">
                        {dayClasses.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CalendarIcon className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-xs text-muted-foreground">
                              Sin clases
                            </p>
                          </div>
                        ) : (
                          dayClasses.map((c: CalendarClass) => {
                            const schedule = c.schedules?.find(
                              (s) => s.dayOfWeek === dayOfWeek
                            );
                            return (
                              <HoverCard key={c.id}>
                                <HoverCardTrigger asChild>
                                  <div
                                    className="group/class p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                                    style={{
                                      borderLeftColor: c.style?.color ?? "#D10000",
                                      borderLeftWidth: 3,
                                    }}
                                  >
                                    <div className="space-y-1.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="font-semibold text-sm truncate group-hover/class:text-primary transition-colors">
                                          {c.name}
                                        </p>
                                        {c.level && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs flex-shrink-0"
                                          >
                                            {c.level}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 text-primary" />
                                        <span>
                                          {schedule?.startTime} -{" "}
                                          {schedule?.endTime}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="font-semibold text-sm">
                                        {c.name}
                                      </p>
                                      {c.level && (
                                        <Badge
                                          variant="outline"
                                          className="mt-1.5 text-xs"
                                        >
                                          {c.level}
                                        </Badge>
                                      )}
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          Horario:
                                        </span>
                                        <span>
                                          {schedule?.startTime} -{" "}
                                          {schedule?.endTime}
                                        </span>
                                      </div>
                                      {c.teacher?.name && (
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                            Profesor:
                                          </span>
                                          <span>{c.teacher.name}</span>
                                        </div>
                                      )}
                                      {c.room?.name && (
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                            Salón:
                                          </span>
                                          <span>{c.room.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenido para vista Día */}
        <TabsContent value="day" className="mt-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateDate(-1)}
                  className="hover:bg-primary/10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  {currentDate.toLocaleDateString("es-CO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateDate(1)}
                  className="hover:bg-primary/10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days.map((day, idx) => {
                  const dayOfWeek = day.getDay();
                  const dayClasses = getClassesForDay(dayOfWeek);
                  const isToday =
                    day.toDateString() === new Date().toDateString();
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-lg border transition-all duration-300 ${
                        isToday
                          ? "border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md shadow-primary/20"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="mb-6">
                        <p
                          className={`text-lg font-semibold mb-1 ${
                            isToday ? "text-primary" : ""
                          }`}
                        >
                          {getDayName(dayOfWeek)}
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            isToday
                              ? "text-primary/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          {day.toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {dayClasses.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">
                              No hay clases programadas
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                              ¡Disfruta tu día libre!
                            </p>
                          </div>
                        ) : (
                          dayClasses.map((c: CalendarClass) => {
                            const schedule = c.schedules?.find(
                              (s) => s.dayOfWeek === dayOfWeek
                            );
                            return (
                              <HoverCard key={c.id}>
                                <HoverCardTrigger asChild>
                                  <div
                                    className="group/class p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                                    style={{
                                      borderLeftColor:
                                        c.style?.color ?? "#D10000",
                                      borderLeftWidth: 4,
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{
                                              backgroundColor:
                                                c.style?.color ?? "#D10000",
                                            }}
                                          />
                                          <p className="font-semibold text-base truncate group-hover/class:text-primary transition-colors">
                                            {c.name}
                                          </p>
                                          {c.level && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs flex-shrink-0"
                                            >
                                              {c.level}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                          <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span>
                                              {schedule?.startTime} -{" "}
                                              {schedule?.endTime}
                                            </span>
                                          </div>
                                          {c.teacher?.name && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                              <User className="h-4 w-4 text-primary" />
                                              <span className="truncate">
                                                {c.teacher.name}
                                              </span>
                                            </div>
                                          )}
                                          {c.room?.name && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                              <MapPin className="h-4 w-4 text-primary" />
                                              <span>{c.room.name}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="font-semibold text-sm">
                                        {c.name}
                                      </p>
                                      {c.level && (
                                        <Badge
                                          variant="outline"
                                          className="mt-1.5 text-xs"
                                        >
                                          {c.level}
                                        </Badge>
                                      )}
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                          Horario:
                                        </span>
                                        <span>
                                          {schedule?.startTime} -{" "}
                                          {schedule?.endTime}
                                        </span>
                                      </div>
                                      {c.teacher?.name && (
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                            Profesor:
                                          </span>
                                          <span>{c.teacher.name}</span>
                                        </div>
                                      )}
                                      {c.room?.name && (
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                            Salón:
                                          </span>
                                          <span>{c.room.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calendar;
