export type Predicate = (value: unknown) => boolean;

export type Validator<T> = (data: T) => void;

export type InputData = Record<string, unknown>;
