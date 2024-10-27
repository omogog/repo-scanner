import { Queue } from '../../domain/abstractions/Queue';

export class InMemoryQueue implements Queue {
  private activeTasks = 0;
  private taskQueue: (() => Promise<void>)[] = [];
  private readonly maxConcurrentTasks: number;

  constructor(maxConcurrentTasks: number) {
    this.maxConcurrentTasks = maxConcurrentTasks;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const executeTask = async () => {
        this.activeTasks++;
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeTasks--;
          this.processQueue();
        }
      };

      if (this.activeTasks < this.maxConcurrentTasks) {
        executeTask();
      } else {
        this.taskQueue.push(executeTask);
      }
    });
  }

  private processQueue() {
    if (this.taskQueue.length && this.activeTasks < this.maxConcurrentTasks) {
      const nextTask = this.taskQueue.shift();
      if (nextTask) nextTask();
    }
  }
}
