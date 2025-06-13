export class InternalError extends Error {
  static readonly ERR_NAME: string = 'InternalError';

  override name: string;

  constructor(message = 'unexpected internal error') {
    super(message);
    this.name = (this.constructor as typeof InternalError).ERR_NAME;
  }

  static from<T extends typeof InternalError>(
    this: T,
    err: unknown,
    format?: (message: string) => string,
  ): InstanceType<T> {
    const rawMessage = err instanceof Error ? err.message : String(err);
    const message = format ? format(rawMessage) : rawMessage;

    if (err instanceof this) {
      err.message = message;
      return err as InstanceType<T>;
    }

    return new this(message) as InstanceType<T>;
  }

  static [Symbol.hasInstance](instance: unknown): boolean {
    if (!(instance instanceof Error)) return false;

    for (
      let proto = Object.getPrototypeOf(instance);
      proto;
      proto = Object.getPrototypeOf(proto)
    ) {
      if (proto.constructor === this) return true;
    }

    return false;
  }
}
