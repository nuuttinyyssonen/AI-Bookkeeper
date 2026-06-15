import winston, { transports } from 'winston';

// Configure Winston logger with different transports for console and file output
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        // To console in development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ level, message, timestamp }) => {
                    const msg = typeof message === "object" ? JSON.stringify(message) : message;
                    return `${timestamp} ${level}: ${msg}`;
                })
            )
        }),
        // To file in production
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" })
    ]
});

export default logger;