export interface Queue<T> {
  add(task: () => Promise<T>): Promise<T>;
}
