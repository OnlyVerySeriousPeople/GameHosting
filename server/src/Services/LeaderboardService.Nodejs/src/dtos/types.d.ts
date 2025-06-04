import * as google from '@bufbuild/protobuf/wkt';

export type FromMessage<T> = Omit<T, '$typeName' | '$unknown'>;

export type Timestamp = FromMessage<google.Timestamp>;
