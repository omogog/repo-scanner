export interface Cache<T> {
  set(key: string, value: T, ttl: number): void;
  get(key: string): T | undefined;
  has(key: string): boolean;
  delete(key: string): void;
}
