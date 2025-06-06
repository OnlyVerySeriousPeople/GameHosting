import fs from 'fs';
import path from 'path';
import pino from 'pino';
import pretty from 'pino-pretty';

const LOGS_DIR = process.env.LOGS_DIR;

if (LOGS_DIR) {
  fs.mkdirSync(LOGS_DIR, {recursive: true});
}

const getLogFileName = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return path.join(LOGS_DIR!, `${day}-${month}-${year}.log`);
};

const createRotatingFileStream = (): pino.DestinationStream => {
  let currentDay = new Date().toDateString();
  let stream = fs.createWriteStream(getLogFileName(), {flags: 'a'});

  return {
    write: (log: string) => {
      const today = new Date().toDateString();
      if (today !== currentDay) {
        stream.end();
        currentDay = today;
        stream = fs.createWriteStream(getLogFileName(), {flags: 'a'});
      }

      try {
        const obj = JSON.parse(log);
        if (obj.err?.stack) delete obj.err.stack;
        stream.write(JSON.stringify(obj) + '\n');
      } catch {
        stream.write(log);
      }
    },
  };
};

const streams: pino.StreamEntry[] = [
  {
    level: 'debug',
    stream: pretty({
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    }),
  },
];

if (LOGS_DIR) {
  streams.push({
    level: 'error',
    stream: createRotatingFileStream(),
  });
}

export const logger = pino(
  {
    level: 'debug',
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  pino.multistream(streams),
);
