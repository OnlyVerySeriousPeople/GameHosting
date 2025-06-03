export class DTO<T extends Record<string, unknown>> {
  private readonly data: T;

  constructor(data: T) {
    if (typeof data !== 'object' || data === null) {
      throw new Error('DTO input must be a non-null object.');
    }
    this.data = data;
  }

  allow<K extends keyof T>(...keys: K[]): Pick<T, K> {
    return Object.fromEntries(keys.map(key => [key, this.data[key]])) as Pick<
      T,
      K
    >;
  }

  allowed<K extends keyof T>(...keys: K[]): DTO<Pick<T, K>> {
    return new DTO(this.allow(...keys));
  }

  exclude<K extends keyof T>(...keys: K[]): Omit<T, K> {
    return Object.fromEntries(
      Object.entries(this.data).filter(([key]) => !keys.includes(key as K)),
    ) as Omit<T, K>;
  }

  excluded<K extends keyof T>(...keys: K[]): DTO<Omit<T, K>> {
    return new DTO(this.exclude(...keys));
  }

  require<K extends keyof T>(...keys: K[]): Required<Pick<T, K>> {
    const required = {} as Required<Pick<T, K>>;
    for (const key of keys) {
      const value = this.data[key];
      if (value === null) {
        throw new Error(`Field "${String(key)}" is required.`);
      }
      required[key] = value;
    }
    return required;
  }

  required<K extends keyof T>(...keys: K[]): DTO<Required<Pick<T, K>>> {
    return new DTO(this.require(...keys));
  }

  requireAll(): Required<T> {
    const required = {} as Required<T>;
    for (const key of Object.keys(this.data) as (keyof T)[]) {
      const value = this.data[key];
      if (value === null) {
        throw new Error(`Field "${String(key)}" is required.`);
      }
      required[key] = value;
    }
    return required;
  }

  requiredAll(): DTO<Required<T>> {
    return new DTO(this.requireAll());
  }

  transform<K extends keyof T, V>(
    key: K,
    fn: (value: T[K]) => V,
  ): Omit<T, K> & Record<K, V> {
    return {...this.data, [key]: fn(this.data[key])} as Omit<T, K> &
      Record<K, V>;
  }

  transformed<K extends keyof T, V>(
    key: K,
    fn: (value: T[K]) => V,
  ): DTO<Omit<T, K> & Record<K, V>> {
    return new DTO(this.transform(key, fn));
  }

  get value(): T {
    return {...this.data};
  }
}
