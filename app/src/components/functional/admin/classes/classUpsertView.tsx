"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BookOpen, Clock, FileText, Loader2, Plus, Save } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription as UiFormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useClasses } from "@/store/hooks";
import type { AdminClassManagement } from "@/store/interfaces/classes";
import {
  upsertClassSchema,
  type UpsertClassFormData,
  type UpsertClassFormInput,
} from "@/schemas/classes";
import { getDayName } from "@/lib/utils";

const levelLabels: Record<AdminClassManagement["level"], string> = {
  iniciacion: "Iniciación",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  open: "Open",
};

const ClassUpsertView = () => {
  const router = useRouter();

  const params = useParams<{ id?: string | string[] }>();
  const id =
    typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const isNew = id === "new";

  const {
    classesData,
    isLoading,
    error,
    getAllClasses,
    upsert,
    isUpserting,
    upsertError,
  } = useClasses();

  const classToEdit = classesData?.classes?.find((c) => c.id === id) ?? null;


  useEffect(() => {

    const hasAnyClasses = (classesData?.classes?.length ?? 0) > 0;
    if (!isNew && !classToEdit && !isLoading && !error && !hasAnyClasses) {

      getAllClasses();
    }
  }, [classToEdit, classesData?.classes?.length, error, getAllClasses, isLoading, isNew]);

  const form = useForm<UpsertClassFormInput>({
    resolver: zodResolver(upsertClassSchema),
    defaultValues: {
      id: undefined,
      name: "",
      description: "",
      styleId: "",
      teacherId: "",
      roomId: "",
      level: "iniciacion",
      creditCost: 1,
      maxCapacity: 20,
      isSpecial: false,
      isActive: true,
      color: "#D10000",
      schedules: [{ dayOfWeek: 1, startTime: "18:00", endTime: "19:00", isActive: true }],
    },
  });

  const schedulesArray = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  useEffect(() => {
    if (isNew) {
      form.reset({
        id: undefined,
        name: "",
        description: "",
        styleId: "",
        teacherId: "",
        roomId: "",
        level: "iniciacion",
        creditCost: 1,
        maxCapacity: 20,
        isSpecial: false,
        isActive: true,
        color: "#D10000",
        schedules: [{ dayOfWeek: 1, startTime: "18:00", endTime: "19:00", isActive: true }],
      });
      return;
    }

    if (classToEdit) {
      form.reset({
        id: classToEdit.id,
        name: classToEdit.name,
        description: classToEdit.description ?? "",
        styleId: classToEdit.style.id,
        teacherId: classToEdit.teacher.id,
        roomId: classToEdit.room.id,
        level: classToEdit.level,
        creditCost: classToEdit.creditCost,
        maxCapacity: classToEdit.maxCapacity,
        isSpecial: classToEdit.isSpecial,
        isActive: classToEdit.isActive,
        color: classToEdit.color ?? classToEdit.style?.color ?? "#D10000",
        schedules: classToEdit.schedules.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isActive: s.isActive,
        })),
      });
    }
  }, [classToEdit, form, isNew]);

  const watched = useWatch({ control: form.control });

  const summary = useMemo(() => {
    const parsed = upsertClassSchema.safeParse(watched);
    if (!parsed.success) return null;

    const data = parsed.data;
    const activeSchedules = data.schedules.filter((s) => s.isActive);
    return {
      isActive: data.isActive,
      isSpecial: data.isSpecial,
      level: data.level,
      creditCost: data.creditCost,
      maxCapacity: data.maxCapacity,
      color: data.color,
      activeSchedulesCount: activeSchedules.length,
      activeDaysLabel:
        activeSchedules.length > 0
          ? activeSchedules
            .map((s) => `${getDayName(s.dayOfWeek)} ${s.startTime}-${s.endTime}`)
            .join(", ")
          : "Sin horarios activos",
    };
  }, [watched]);

  const save = async (mode: "stay" | "exit", values: UpsertClassFormInput) => {

    const data: UpsertClassFormData = upsertClassSchema.parse(values);
    const result = await upsert({
      id: data.id,
      name: data.name,
      description: data.description,
      styleId: data.styleId,
      teacherId: data.teacherId,
      roomId: data.roomId,
      level: data.level,
      creditCost: data.creditCost,
      maxCapacity: data.maxCapacity,
      isSpecial: data.isSpecial,
      isActive: data.isActive,
      color: data.color,
      schedules: data.schedules,
    });

    if (mode === "exit") {
      router.push("/admin/classes");
      return;
    }

    if (isNew) {
      router.replace(`/admin/classes/${result.id}`);
    }
  };



  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isNew && !classToEdit && !isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {error ? "Error al cargar" : "Clase no encontrada"}
          </h1>
          <p className="text-muted-foreground">
            {error
              ? "Ocurrió un error al intentar cargar la clase."
              : "No se pudo cargar la clase solicitada."}
          </p>
        </div>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Link href="/admin/classes">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a clases
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <Link href="/admin/classes" className="inline-flex">
            <Button variant="outline" size="sm" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">
            {isNew ? (
              <>
                Nueva <span className="gradient-text">Clase</span>
              </>
            ) : (
              <>
                Editar <span className="gradient-text">Clase</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isNew
              ? "Crea una nueva clase y define su programación."
              : "Actualiza la información y horarios de la clase."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full md:w-auto">
          <Button
            variant="outline"
            onClick={form.handleSubmit((v) => save("stay", v))}
            disabled={isUpserting}
            className="w-full md:w-auto"
          >
            {isUpserting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {!isUpserting ? <Save className="h-4 w-4 mr-2" /> : null}
            Guardar
          </Button>
          <Button
            onClick={form.handleSubmit((v) => save("exit", v))}
            disabled={isUpserting}
            className="w-full md:w-auto"
          >
            {isUpserting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar y salir
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {upsertError && (
        <Alert variant="destructive">
          <AlertTitle>Error al guardar</AlertTitle>
          <AlertDescription>{upsertError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Información principal
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Datos básicos de la clase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la clase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Input placeholder="Descripción (opcional)" {...field} />
                        </FormControl>
                        <UiFormDescription>
                          Útil para aclarar el enfoque o nivel de la clase.
                        </UiFormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nivel</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              <option value="iniciacion">Iniciación</option>
                              <option value="intermedio">Intermedio</option>
                              <option value="avanzado">Avanzado</option>
                              <option value="open">Open</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Costo en créditos</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              value={
                                typeof field.value === "number" ||
                                  typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cupo máximo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              value={
                                typeof field.value === "number" ||
                                  typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input
                              type="color"
                              value={field.value ?? "#D10000"}
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="h-10 w-14 p-1"
                            />
                            <Input
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="#RRGGBB"
                              className="font-mono"
                            />
                          </div>
                        </FormControl>
                        <UiFormDescription>
                          Se usa para identificar la clase visualmente (ej. borde en el listado).
                        </UiFormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <FormLabel>Activa</FormLabel>
                            <UiFormDescription>
                              Visible y disponible para programación.
                            </UiFormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-primary"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isSpecial"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <FormLabel>Especial</FormLabel>
                            <UiFormDescription>
                              Marca la clase como evento/edición especial.
                            </UiFormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-primary"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <Card className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Relaciones (IDs)</CardTitle>
                      <CardDescription>
                        Temporalmente por ID; luego podemos reemplazar por selects.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="styleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>styleId</FormLabel>
                            <FormControl>
                              <Input placeholder="UUID estilo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teacherId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>teacherId</FormLabel>
                            <FormControl>
                              <Input placeholder="UUID profesor" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="roomId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>roomId</FormLabel>
                            <FormControl>
                              <Input placeholder="UUID sala" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  </div>
                </CardContent>
              </Card>

          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="h-5 w-5 text-primary" />
                    Horarios
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Define uno o varios horarios
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    schedulesArray.append({
                      dayOfWeek: 1,
                      startTime: "18:00",
                      endTime: "19:00",
                      isActive: true,
                    })
                  }
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-6" />
              <div className="space-y-4">
                {schedulesArray.fields.map((f, index) => (
                  <div key={f.id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Horario #{index + 1}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => schedulesArray.remove(index)}
                        disabled={schedulesArray.fields.length <= 1}
                      >
                        Quitar
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      <FormField
                        control={form.control}
                        name={`schedules.${index}.dayOfWeek`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Día (0-6)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={6}
                                value={
                                  typeof field.value === "number" ||
                                    typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedules.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inicio</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedules.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fin</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schedules.${index}.isActive`}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-md border p-3">
                            <FormLabel>Activo</FormLabel>
                            <FormControl>
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </form>
          </Form>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-primary" />
                Resumen
              </CardTitle>
              <CardDescription className="mt-1">
                Vista rápida del estado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant={summary?.isActive ? "default" : "secondary"}>
                  {summary?.isActive ? "Activa" : "Inactiva"}
                </Badge>
                {summary?.isSpecial ? (
                  <Badge variant="secondary">Especial</Badge>
                ) : null}
                {summary?.level ? (
                  <Badge variant="outline">
                    {levelLabels[summary.level as AdminClassManagement["level"]]}
                  </Badge>
                ) : null}
              </div>

              <Separator />

              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cupo</span>
                  <span className="font-medium">{summary?.maxCapacity ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Créditos</span>
                  <span className="font-medium">{summary?.creditCost ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-medium inline-flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full border"
                      style={{ backgroundColor: summary?.color ?? "#D10000" }}
                    />
                    <span className="font-mono">{summary?.color ?? "#D10000"}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Horarios activos</span>
                  <span className="font-medium">{summary?.activeSchedulesCount ?? 0}</span>
                </div>
              </div>

              <Separator />

              <p className="text-sm text-muted-foreground">
                {summary?.activeDaysLabel ?? "Completa los campos para ver el resumen."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassUpsertView;

