import { BaseTask } from "./BaseTask";
import { BehaviorTree } from "./BehaviorTree";
import { GuardEvaluator } from "./GuardEvaluator";
import { Task } from "./Task";
import { TaskStatus } from "./TaskStatus";

/** The behavior tree itself. */
export class BaseBehaviorTree<T> extends BaseTask<T> implements BehaviorTree {
    private rootTask?: Task;
    private object?: T;

    public guardEvaluator: GuardEvaluator<T>;

    public constructor(rootTask?: Task, object?: T) {
        super();
        this.rootTask = rootTask;
        this.object = object;
        this.tree = this;
        this.guardEvaluator = new GuardEvaluator(this);
    }

    public addChild(child: Task): this {
        if (this.rootTask !== undefined) {
            throw new Error('A behavior tree cannot have more than one root task.');
        }
        this.rootTask = child;
        return this;
    }

    public getChildCount(): number {
        return this.rootTask === undefined ? 0 : 1;
    }

    public getChild(index: number): Task {
        if (index === 0 && this.rootTask !== undefined) {
            return this.rootTask;
        }
        throw new Error(`Index cannot be >= size: ${index} >= ${this.getChildCount()}.`);
    }

    public getObject(): T {
        if (this.object === undefined) {
            throw new Error('Invalid state.');
        }
        return this.object;
    }

    public setObject(object: T): void {
        this.object = object;
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

    public step(): void {
        const task = this.rootTask;
        if (task === undefined) {
            throw new Error('Invalid state.');
        }
        if (task.getStatus() === TaskStatus.Running) {
            task.run();
        } else {
            task.setControl(this);
            task.start();
            if (task.checkGuard(this)) {
                task.run();
            } else {
                task.fail();
            }
        }
    }

    public run(): void {
    }

    public resetTask(): void {
        super.resetTask();

        // Re-assign tree.
        this.tree = this;
    }

    public reset(): void {
        super.reset();
        this.rootTask = undefined;
        this.object = undefined;
    }
}