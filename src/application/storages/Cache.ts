export interface Cache<T> {
  set(key: string, value: T, ttl?: number): void;
  get(key: string): T | undefined;
  has(key: string): boolean;
  delete(key: string): void;
  // this implementation need to avoid possible race condition when we have few requests to the same resource
  getOrFetch(key: string, fetchFunction: () => Promise<T>): Promise<T>
}