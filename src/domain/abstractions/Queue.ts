export interface Queue {
  add<T>(task: () => Promise<T>): Promise<T>;
}
