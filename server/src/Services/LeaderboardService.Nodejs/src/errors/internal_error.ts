const ERR_NAME = 'InternalError';

export class InternalError extends Error {
  override name = ERR_NAME;

  constructor(message = 'unexpected internal error') {
    super(message);
  }

  static from<T extends typeof InternalError>(
    this: T,
    err: unknown,
  ): InstanceType<T> {
    const message = err instanceof Error ? err.message : String(err);
    return new this(message) as InstanceType<T>;
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    return (
      instance instanceof Error &&
      (instance.name === ERR_NAME ||
        Object.getPrototypeOf(instance)?.constructor?.name === ERR_NAME)
    );
  }
}
