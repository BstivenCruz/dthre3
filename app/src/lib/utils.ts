import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "Fecha no disponible";
  
  // Parsear la fecha usando la función parseDate
  const date = parseDate(dateString);
  
  if (!date) {
    console.warn('Fecha inválida:', dateString);
    return "Fecha inválida";
  }
  
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getDayName(dayOfWeek: number): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[dayOfWeek] || "";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parsea una fecha string a Date object, manejando diferentes formatos
 * Soporta formatos como:
 * - 2026-02-01T21:32:22-03 (offset corto)
 * - 2026-02-01T21:32:22-03:00 (offset completo)
 * - 2026-02-01T21:32:22Z (UTC)
 * - 2026-02-01T21:32:22 (sin timezone)
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const trimmed = dateString.trim();
  let date: Date | null = null;
  
  try {
    // Patrón para detectar formato: 2026-02-01T21:32:22-03 o 2026-02-01T21:32:22-03:00
    // Captura: año, mes, día, hora, minuto, segundo, signo del offset, horas offset, minutos offset (opcional)
    const isoPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-])(\d{2})(?::(\d{2}))?$/;
    const match = trimmed.match(isoPattern);
    
    if (match) {
      const [, year, month, day, hour, minute, second, offsetSign, offsetHours, offsetMinutes = '00'] = match;
      
      // Construir fecha en formato estándar ISO con offset completo
      // Ejemplo: 2026-02-01T21:32:22-03:00
      const standardFormat = `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSign}${offsetHours}:${offsetMinutes}`;
      date = new Date(standardFormat);
      
      // Si aún no es válida, intentar construir manualmente
      if (isNaN(date.getTime())) {
        // Parsear componentes manualmente
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1; // Los meses en Date son 0-indexed
        const dayNum = parseInt(day, 10);
        const hourNum = parseInt(hour, 10);
        const minuteNum = parseInt(minute, 10);
        const secondNum = parseInt(second, 10);
        const offsetHoursNum = parseInt(offsetHours, 10);
        const offsetMinutesNum = parseInt(offsetMinutes, 10);
        const offsetTotalMinutes = (offsetSign === '-' ? -1 : 1) * (offsetHoursNum * 60 + offsetMinutesNum);
        
        // Crear fecha en UTC y ajustar por el offset
        date = new Date(Date.UTC(
          yearNum,
          monthNum,
          dayNum,
          hourNum,
          minuteNum - offsetTotalMinutes,
          secondNum
        ));
      }
    } else {
      // Si no coincide el patrón, intentar parsear directamente
      // Primero intentar con el string tal cual
      date = new Date(trimmed);
      
      if (isNaN(date.getTime())) {
        // Si tiene T pero no coincide el patrón, puede ser formato sin timezone
        // Intentar agregar Z (UTC) o parsear sin timezone
        const noTimezoneMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
        if (noTimezoneMatch) {
          // Intentar como UTC
          date = new Date(noTimezoneMatch[1] + 'Z');
          // Si tampoco funciona, parsear sin timezone (se interpreta como hora local)
          if (isNaN(date.getTime())) {
            date = new Date(noTimezoneMatch[1]);
          }
        }
      }
    }
    
    // Verificar si la fecha es válida
    if (!date || isNaN(date.getTime())) {
      console.warn('Error al parsear fecha después de múltiples intentos:', dateString);
      console.warn('Formato detectado:', trimmed);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error al parsear fecha:', error, dateString);
    return null;
  }
}
