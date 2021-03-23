import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const LOG_DIR = process.env.LOG_DIR || 'logs';
const ERROR_LOG_DIR = process.env.ERROR_LOG_DIR || 'logs/error';
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
        printf(info => `${info.timestamp} ${info.level} ${info.message} ${JSON.stringify(info.metadata, null, 2)}`),
    ),
    transports: [
        new winstonDaily({
            level: 'verbose',
            datePattern: 'YYYY-MM-DD',
            dirname: LOG_DIR,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: ERROR_LOG_DIR,
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ]
});

logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    )
}));

export default logger;