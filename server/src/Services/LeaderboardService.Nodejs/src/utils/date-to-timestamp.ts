import {Timestamp} from '@bufbuild/protobuf/wkt';

export function dateToTimestamp(
  date: Date,
): Pick<Timestamp, 'seconds' | 'nanos'> {
  const ms = date.getTime();
  return {
    seconds: BigInt(Math.floor(ms / 1000)),
    nanos: (ms % 1000) * 1e6,
  };
}
