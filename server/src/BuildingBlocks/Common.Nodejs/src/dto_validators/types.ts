export type Predicate = (value: unknown) => boolean;

export type Validator<T> = (data: T) => void;

export type Data = Record<string, unknown>;
