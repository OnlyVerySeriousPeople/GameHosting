export class InternalError extends Error {
  override name = 'InternalError';

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
      (instance.name === 'InternalError' ||
        Object.getPrototypeOf(instance)?.constructor?.name === 'InternalError')
    );
  }

  override toString(): string {
    return this.name + ': ' + this.message;
  }
}
