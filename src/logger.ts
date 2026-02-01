import pino, { type LoggerOptions } from 'pino';

const getTargets = () => {
    const targets: any[] = [{
        target: 'pino-mongodb',
        level: 'info',
        options: {
            uri: process.env.MONGO_HOST,
            database: process.env.MONGO_DATABASE,
            collection: process.env.MONGO_COLLECTION,
            mongoOptions: {
                auth: {
                    username: process.env.MONGO_USER,
                    password: process.env.MONGO_PASSWORD,
                },
                authSource: process.env.MONGO_AUTH_SOURCE
            }
        }
    }];

    if (process.env.ENVIRONMENT === 'development') {
        targets.push({
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
                ignore: 'pid,hostname',
            },
        });
    }

    return { targets };
}

const transport = pino.transport(getTargets());
const options: LoggerOptions = {
    level: process.env.PINO_LOG_LEVEL!,
    timestamp: pino.stdTimeFunctions.epochTime
}

export const Logger = pino(options, transport);