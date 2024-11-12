"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinkedListQueue_1 = require("../src/infrastructure/queues/LinkedListQueue");
describe("LinkedListQueue - Concurrency Control", () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    it("does not exceed the maximum concurrency limit", async () => {
        const maxConcurrentTasks = 3;
        const queue = new LinkedListQueue_1.LinkedListQueue(maxConcurrentTasks);
        let activeTasks = 0;
        let maxObservedConcurrency = 0;
        const createTask = (duration, result) => () => new Promise(async (resolve) => {
            activeTasks++;
            maxObservedConcurrency = Math.max(maxObservedConcurrency, activeTasks);
            await delay(duration);
            activeTasks--;
            resolve(result);
        });
        const tasks = [
            queue.add(createTask(100, 1)),
            queue.add(createTask(100, 2)),
            queue.add(createTask(100, 3)),
            queue.add(createTask(100, 4)),
            queue.add(createTask(100, 5))
        ];
        await Promise.all(tasks);
        expect(maxObservedConcurrency).toBeLessThanOrEqual(maxConcurrentTasks);
    });
});
describe("LinkedListQueue", () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    it("initializes with the correct concurrency limit", () => {
        const queue = new LinkedListQueue_1.LinkedListQueue(3);
        expect(queue).toBeDefined();
    });
    it("processes tasks and returns expected results", async () => {
        const queue = new LinkedListQueue_1.LinkedListQueue(2);
        const taskA = () => Promise.resolve("Task A completed");
        const taskB = () => Promise.resolve("Task B completed");
        const resultA = queue.add(taskA);
        const resultB = queue.add(taskB);
        await expect(resultA).resolves.toBe("Task A completed");
        await expect(resultB).resolves.toBe("Task B completed");
    });
    it("respects the maximum concurrency limit", async () => {
        const maxConcurrentTasks = 3;
        const queue = new LinkedListQueue_1.LinkedListQueue(maxConcurrentTasks);
        let activeTasks = 0;
        let maxObservedConcurrency = 0;
        const createTask = (name, duration) => () => new Promise(async (resolve) => {
            activeTasks++;
            maxObservedConcurrency = Math.max(maxObservedConcurrency, activeTasks);
            await delay(duration);
            activeTasks--;
            resolve(name);
        });
        const taskPromises = [
            queue.add(createTask(1, 100)),
            queue.add(createTask(2, 100)),
            queue.add(createTask(3, 100)),
            queue.add(createTask(4, 100)),
            queue.add(createTask(5, 100))
        ];
        await Promise.all(taskPromises);
        expect(maxObservedConcurrency).toBeLessThanOrEqual(maxConcurrentTasks);
    });
    it("handles errors in tasks", async () => {
        const queue = new LinkedListQueue_1.LinkedListQueue(2);
        const taskA = () => Promise.reject(new Error("Task A failed"));
        const taskB = () => Promise.resolve("Task B completed");
        await expect(queue.add(taskA)).rejects.toThrow("Task A failed");
        await expect(queue.add(taskB)).resolves.toBe("Task B completed");
    });
    it("automatically starts processing when tasks are added", async () => {
        const queue = new LinkedListQueue_1.LinkedListQueue(2);
        const taskA = jest.fn(() => Promise.resolve("Task A completed"));
        const taskB = jest.fn(() => Promise.resolve("Task B completed"));
        queue.add(taskA);
        queue.add(taskB);
        await delay(50);
        expect(taskA).toHaveBeenCalled();
        expect(taskB).toHaveBeenCalled();
    });
});
//# sourceMappingURL=LinkedListQueue.test.js.map