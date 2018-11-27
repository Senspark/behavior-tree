import assert = require('assert');
import { BaseBehaviorTree } from "./BaseBehaviorTree";
import { Task } from "./Task";
import { TaskStatus } from "./TaskStatus";

/**
 * This is the abstract base class of all behavior tree tasks.
 * @param T The type of the blackboard object that tasks use to read or modify game state.
 */
export abstract class BaseTask<T> implements Task {
    /** The status of this task. */
    private status: TaskStatus;

    /** The guard of this task. */
    private guard?: Task;

    /** The parent of this task. */
    private control?: Task;

    public tree?: BaseBehaviorTree<T>;

    public constructor() {
        this.status = TaskStatus.Invalid;
    }

    public getStatus(): TaskStatus {
        return this.status;
    }

    public getObject(): T {
        if (this.tree === undefined) {
            throw new Error('This task has never run.');
        }
        return this.tree.getObject();
    }

    public setGuard(guard: Task): this {
        this.guard = guard;
        return this;
    }

    public setControl(control: BaseTask<T>): void {
        this.control = control;
        this.tree = control.tree;
    }

    public abstract addChild(child: Task): this;
    public abstract getChildCount(): number;
    public abstract getChild(index: number): Task;

    public checkGuard(control: Task): boolean {
        if (this.guard === undefined) {
            // No guard to check.
            return true;
        }
        // Check the guard of the guard recursively.
        if (!this.guard.checkGuard(control)) {
            return false;
        }

        if (control.tree === undefined) {
            throw new Error('Invalid state.');
        }

        // Use the tree's guard evaluator task to check the guard of this task.
        this.guard.setControl(control.tree.guardEvaluator);
        this.guard.start();
        this.guard.run();
        const status = this.guard.getStatus();
        if (status === TaskStatus.Succeeded) {
            return true;
        }
        if (status === TaskStatus.Failed) {
            return false;
        }
        throw new Error('Illegal guard status. Guard must either succeed or fail in one step.');
    }

    public start(): void { }
    public end(): void { }
    public abstract run(): void;

    public success(): void {
        this.status = TaskStatus.Succeeded;
        this.end();
        this.control && this.control.childSuccess(this);
    }

    public fail(): void {
        this.status = TaskStatus.Failed;
        this.end();
        this.control && this.control.childFail(this);
    }

    public running(): void {
        this.status = TaskStatus.Running;
        this.control && this.control.childRunning(this, this);
    }

    public abstract childSuccess(runningTask: Task): void;
    public abstract childFail(runningTask: Task): void;
    public abstract childRunning(runningTask: Task, reporter: Task): void;

    public cancel(): void {
        assert(this.getStatus() === TaskStatus.Running);
        this.status = TaskStatus.Canceled;
        this.end();
    }

    /** Terminates the running children of this task starting from the specified inex up to the end. */
    public cancelRunningChildren(startIndex: number): void {
        for (let i = startIndex, n = this.getChildCount(); i < n; ++i) {
            const child = this.getChild(i);
            if (child.getStatus() === TaskStatus.Running) {
                child.cancel();
            }
        }
    }

    /** Resets this task to make it restart from scratch on next run. */
    public resetTask(): void {
        if (this.status === TaskStatus.Running) {
            this.cancel();
        }
        for (let i = 0, n = this.getChildCount(); i < n; ++i) {
            const child = this.getChild(i);
            child.resetTask();
        }
        this.status = TaskStatus.Invalid;
        this.control = undefined;
        this.tree = undefined;
    }

    public reset(): void {
        this.status = TaskStatus.Invalid;
        this.guard = undefined;
        this.control = undefined;
        this.tree = undefined;
    }
}