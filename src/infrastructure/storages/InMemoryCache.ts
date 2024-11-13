import { Cache } from '../../application/storages';

export class InMemoryCache<T> implements Cache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();
  private inFlightRequests = new Map<string, Promise<T>>();

  constructor(private defaultTtl: number = 300) {}

  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl ?? this.defaultTtl) * 1000;
    this.cache.set(key, { value, expiry });
    this.inFlightRequests.delete(key);
  }

  async getOrFetch(key: string, fetchFunction: () => Promise<T>): Promise<T> {
    const cachedValue = this.get(key);
    if (cachedValue) {
      return cachedValue;
    }

    if (!this.inFlightRequests.has(key)) {
      const inFlight = fetchFunction()
        .then((result) => {
          this.set(key, result);
          this.inFlightRequests.delete(key);
          return result;
        })
        .catch((error) => {
          this.inFlightRequests.delete(key);
          throw error;
        });
      this.inFlightRequests.set(key, inFlight);
    }

    return this.inFlightRequests.get(key)!;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.value;
    } else if (entry) {
      this.cache.delete(key);
    }
    return undefined;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.inFlightRequests.delete(key);
  }
}
