import { BaseTask } from "../BaseTask";
import { Task } from "../Task";
import { TaskStatus } from "../TaskStatus";

/**
 * A decorator is a wrapper that provides custom behavior for its child.
 * The child can be of any kind (branch task, leaf task or another decorator).
 */
export abstract class Decorator<T> extends BaseTask<T> {
    protected child?: Task;

    public constructor(child?: Task) {
        super();
        this.child = child;
    }

    public addChild(child: Task): this {
        if (this.child !== undefined) {
            throw new Error('A decorator task cannot have more than once child.');
        }
        this.child = child;
        return this;
    }

    public getChildCount(): number {
        return this.child === undefined ? 0 : 1;
    }

    public getChild(index: number): Task {
        if (index === 0 && this.child !== undefined) {
            return this.child;
        }
        throw new Error(`Index cannot be >= size: ${index} >= ${this.getChildCount()}.`);
    }

    public run(): void {
        const child = this.child;
        if (child === undefined) {
            throw new Error('This decorator has no child to run.');
        }
        if (child.getStatus() === TaskStatus.Running) {
            child.run();
        } else {
            child.setControl(this);
            child.start();
            if (child.checkGuard(this)) {
                child.run();
            } else {
                child.fail();
            }
        }
    }

    public childSuccess(runningTask: Task): void {
        this.success();
    }

    public childFail(runningTask: Task): void {
        this.fail();
    }

    public childRunning(runningTask: Task, reporter: Task): void {
        this.running();
    }

    public reset(): void {
        super.reset();
        this.child = undefined;
    }
}