import { Queue } from '../../application/queues';

class LinkedListNode<T> {
  public next: LinkedListNode<T> | null = null;

  constructor(
    public readonly task: () => Promise<T>,
    public readonly resolve: (value: T | PromiseLike<T>) => void,
    public readonly reject: (reason?: any) => void
  ) {}
}

export class LinkedListQueue<T> implements Queue<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private activeTasks = 0;
  private readonly maxConcurrentTasks: number;
  private processing = false;

  constructor(maxConcurrentTasks: number) {
    if (maxConcurrentTasks < 1)
      throw new Error('maxConcurrentTasks must be at least 1');
    this.maxConcurrentTasks = maxConcurrentTasks;
  }

  add(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const node = new LinkedListNode(task, resolve, reject);

      if (this.tail) {
        this.tail.next = node;
      } else {
        this.head = node;
      }
      this.tail = node;

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.head && this.activeTasks < this.maxConcurrentTasks) {
      const currentNode = this.head;
      this.head = this.head.next;
      if (!this.head) this.tail = null;

      this.activeTasks++;

      currentNode
        .task()
        .then((result) => {
          currentNode.resolve(result);
        })
        .catch((error) => {
          currentNode.reject(error);
        })
        .finally(() => {
          this.activeTasks--;

          if (this.head && this.activeTasks < this.maxConcurrentTasks) {
            this.processQueue();
          } else {
            this.processing = false;
          }
        });
    }

    this.processing = false;
  }
}
