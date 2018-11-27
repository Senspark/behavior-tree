import { BehaviorTree } from "./BehaviorTree";
import { TaskStatus } from "./TaskStatus";

export interface Task {
    /** The behavior tree this task belongs to. */
    tree?: BehaviorTree;

    /** Returns the status of this task. */
    getStatus(): TaskStatus;

    /** Sets the guard of this task. */
    setGuard(guard: Task): this;

    /** Sets a task as this task's parent. */
    setControl(control: Task): void;

    /**
     * Adds a child to the list of this task's children.
     * @return Instance to this for method chaining.
     */
    addChild(child: Task): this;

    /** Returns the number of children of this task. */
    getChildCount(): number;

    /** Returns the child at the given index. */
    getChild(index: number): Task;

    /** Checks the guard of this task. */
    checkGuard(control: Task): boolean;

    /** This method will be called once before this task's first run. */
    start(): void;

    /**
     * This method will be called by success(), fail() or cancel(),
     * meaning that this task's status has just been set to
     * Succeeded, Failed or Canceled respectively.
     */
    end(): void;

    /**
     * This method contains the update logic of this task.
     * The actual implementation msut call running(), success() or fail() exactly once.
     */
    run(): void;

    /**
     * This method will be called in run() to inform control that
     * this task has finished running with a success result.
     */
    success(): void;

    /**
     * This method will be called in run() to inform control that
     * this task has finished running with a failure result
     */
    fail(): void;

    /**
     * This method will be called in run() to inform control that
     * this task needs to run again.
     */
    running(): void;

    /**
     * This method will be called when one of the children of this task succeeds.
     * @param runningTask The task that succeeded.
     */
    childSuccess(runningTask: Task): void;

    /**
     * This method will be called when one of the children of this task fails.
     * @param runningTask The task that failed.
     */
    childFail(runningTask: Task): void;

    /**
     * This method will be called when one of the ancestors of this task need to run again.
     * @param runningTask The task that needs to run again.
     * @param reporter The task that reports, usually one of this task's children.
     */
    childRunning(runningTask: Task, reporter: Task): void;

    /**
     * Terminates this task and all its running children.
     * This method must be called only if this task is running.
     */
    cancel(): void;

    /** Resets this task to make it restart from scratch on next run. */
    resetTask(): void;

    reset(): void;
}