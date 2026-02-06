import { createLogger, format, transports } from "winston";

// ═══════════════════════════════════════════════════════════════════════════════════
// 🕒 UTILIDADES DE FECHA
// ═══════════════════════════════════════════════════════════════════════════════════

const datetoString = () => {
  const offset = new Date().getTimezoneOffset();
  const yourDate = new Date(new Date().getTime() + offset * 60 * 1000);
  return yourDate.toISOString().split("T")[0];
};

// ═══════════════════════════════════════════════════════════════════════════════════
// 🎨 FORMATOS DE LOG
// ═══════════════════════════════════════════════════════════════════════════════════

const baseFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.printf((info) => {
    let colorizedMessage = String(info.message);

    colorizedMessage = colorizedMessage.replace(
      /(\/api\/[^\s',}]+)/g,
      "\x1b[33m$1\x1b[0m"
    );

    colorizedMessage = colorizedMessage.replace(
      /(['"]\w+\/\w+[^'"]*['"])/g,
      "\x1b[33m$1\x1b[0m"
    );

    return `${info.timestamp} ${info.level}: [${
      info.util || "app"
    }] ${colorizedMessage}${
      info.error
        ? ` Error: ${
            info.error instanceof Error ? info.error.stack : String(info.error)
          }`
        : ""
    }`;
  })
);

// ═══════════════════════════════════════════════════════════════════════════════════
// 📝 CONFIGURACIÓN DE TRANSPORTES
// ═══════════════════════════════════════════════════════════════════════════════════

const fileTransport = new transports.File({
  maxsize: 512000,
  filename: `${__dirname}/../../logs/log-api-${datetoString()}.log`,
});

const consoleTransport = new transports.Console({
  level: "debug",
  format: consoleFormat,
});

// ═══════════════════════════════════════════════════════════════════════════════════
// 🚀 LOGGER PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════════

export default createLogger({
  format: baseFormat,
  transports: [fileTransport, consoleTransport],
});
