import { z } from "zod";

const timeHHmm = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Formato inválido. Usa HH:mm");

export const classLevelSchema = z.enum([
  "iniciacion",
  "intermedio",
  "avanzado",
  "open",
]);

export const upsertClassSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional(),
  styleId: z.string().min(1, "styleId es obligatorio"),
  teacherId: z.string().min(1, "teacherId es obligatorio"),
  roomId: z.string().min(1, "roomId es obligatorio"),
  level: classLevelSchema,
  creditCost: z.coerce.number().int().min(0, "Debe ser 0 o mayor"),
  maxCapacity: z.coerce.number().int().min(1, "Debe ser 1 o mayor"),
  isSpecial: z.coerce.boolean(),
  isActive: z.coerce.boolean(),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Color inválido (usa formato #RRGGBB)")
    .default("#D10000"),
  schedules: z
    .array(
      z.object({
        dayOfWeek: z.coerce.number().int().min(0).max(6),
        startTime: timeHHmm,
        endTime: timeHHmm,
        isActive: z.coerce.boolean(),
      })
    )
    .min(1, "Debes agregar al menos un horario"),
});

export type UpsertClassFormData = z.infer<typeof upsertClassSchema>;
export type UpsertClassFormInput = z.input<typeof upsertClassSchema>;
