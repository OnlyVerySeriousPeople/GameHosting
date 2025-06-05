import {Timestamp} from '../dtos/types';

export function dateToTimestamp(date: Date): Timestamp {
  const ms = date.getTime();
  return {
    seconds: BigInt(Math.floor(ms / 1000)),
    nanos: (ms % 1000) * 1e6,
  };
}
