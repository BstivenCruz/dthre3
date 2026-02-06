/**
 * Utilidades para manejo de errores en stores y servicios
 */

/**
 * Normaliza un error desconocido a un mensaje de error string.
 * Maneja diferentes tipos de errores:
 * - Error estándar de JavaScript
 * - Strings
 * - Errores de axios (con response.data.message)
 * - Otros objetos desconocidos
 *
 * @param error - El error a normalizar
 * @returns Un mensaje de error como string
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object"
  ) {
    const axiosError = error as {
      response?: {
        data?: { 
          message?: string; 
          error?: string | { message?: string; details?: unknown };
          output?: { payload?: { message?: string } };
        };
        status?: number;
      };
      message?: string;
    };

    // Intentar obtener mensaje de response.data
    if (axiosError.response?.data) {
      const data = axiosError.response.data;
      
      // Si error es un objeto con message (común en errores de Joi/boom)
      if (data.error && typeof data.error === "object" && "message" in data.error) {
        const errorMessage = data.error.message;
        if (errorMessage && typeof errorMessage === "string") {
          return errorMessage;
        }
      }
      
      // Si error es un string
      if (data.error && typeof data.error === "string") {
        return data.error;
      }
      
      // Intentar obtener de output.payload.message (formato boom)
      if (data.output?.payload?.message) {
        return String(data.output.payload.message);
      }
      
      // Intentar obtener de message directamente
      if (data.message) {
        return String(data.message);
      }
    }

    // Si no hay mensaje, usar el mensaje del error de axios
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  return "Error desconocido";
};

/**
 * Convierte un mensaje de error técnico en un mensaje amigable para el usuario.
 * Oculta detalles técnicos como códigos de estado HTTP y mensajes de axios.
 *
 * @param errorMessage - El mensaje de error técnico
 * @param context - Contexto de la operación (opcional, para personalizar el mensaje)
 * @returns Un mensaje de error amigable para el usuario
 */
export const getUserFriendlyErrorMessage = (
  errorMessage: string,
  context?: string
): string => {
  // Mensajes técnicos comunes que deben ser reemplazados
  const technicalMessages: Record<string, string> = {
    "Request failed with status code 500":
      "Ocurrió un error. Por favor, intenta nuevamente.",
    "Request failed with status code 404":
      "No se encontró la información solicitada.",
    "Request failed with status code 403":
      "No tienes permisos para realizar esta acción.",
    "Request failed with status code 401":
      "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    "Request failed with status code 400":
      "Los datos ingresados no son válidos. Por favor, verifícalos e intenta nuevamente.",
    "Network Error":
      "No se pudo conectar. Por favor, verifica tu conexión e intenta nuevamente.",
    "timeout of":
      "La operación tardó demasiado tiempo. Por favor, intenta nuevamente.",
  };

  // Buscar mensajes técnicos conocidos
  for (const [technical, friendly] of Object.entries(technicalMessages)) {
    if (errorMessage.includes(technical)) {
      return friendly;
    }
  }

  // Si el mensaje contiene códigos de estado HTTP, reemplazarlos
  const statusCodeMatch = errorMessage.match(/status code (\d+)/i);
  if (statusCodeMatch) {
    const statusCode = statusCodeMatch[1];
    const statusMessages: Record<string, string> = {
      "500": "Ocurrió un error. Por favor, intenta nuevamente.",
      "404": "No se encontró la información solicitada.",
      "403": "No tienes permisos para realizar esta acción.",
      "401": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
      "400": "Los datos ingresados no son válidos. Por favor, verifícalos e intenta nuevamente.",
    };
    return statusMessages[statusCode] || "Ocurrió un error. Por favor, intenta nuevamente.";
  }

  // Si el mensaje parece técnico (contiene palabras clave), usar mensaje genérico
  const technicalKeywords = [
    "axios",
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
    "ERR_",
    "Network",
    "timeout",
  ];
  const isTechnical = technicalKeywords.some((keyword) =>
    errorMessage.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isTechnical) {
    return context
      ? `No fue posible ${context}. Por favor, intenta nuevamente.`
      : "Ocurrió un error. Por favor, intenta nuevamente.";
  }

  // Si el mensaje ya es amigable, devolverlo tal cual
  return errorMessage;
};

