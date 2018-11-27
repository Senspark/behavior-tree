import { BranchTask } from "../base";
import { Task } from "../Task";
import { ParallelOrchestrator } from "./ParallelOrchestrator";
import { ParallelOrchestratorResume } from "./ParallelOrchestratorResume";
import { ParallelPolicy } from "./ParallelPolicy";
import { ParallelPolicySequence } from "./ParallelPolicySequence";
import { ParallelResult } from "./ParallelResult";

/**
 * A Parallel is a special branch task that runs all children when stepped.
 *
 * Its actual behavior depends on its orchestrator and policy.
 *
 * The execution of the parallel task's children depends on its orchestrator:
 * - Orchestrator.Resume: the parallel task restarts or runs each child every step.
 * - Orchestrator.Join: child tasks will run until success or failure but will not
 * re-run until the parallel task has succeeded or failed.
 *
 * The actual result of the parallel task depends on its policy:
 * - Policy.Sequence: the parallel task fails as soon as one child fails; if all
 * children succeed, then the parallel task succeeds. This is the default policy.
 * - Policy.Selector: the parallel task succeeds as soon as one child succeeds;
 * if all children fail, then the parallel task fails.
 *
 * The typical use case: make the game entity react on event while sleeping or wandering.
 */
export class Parallel<T> extends BranchTask<T> {
    public orchestrator: ParallelOrchestrator;
    public policy: ParallelPolicy;
    public noRunningTasks: boolean;
    public currentChildIndex: number;
    public lastResult: ParallelResult;

    public constructor() {
        super();
        this.orchestrator = new ParallelOrchestratorResume();
        this.policy = new ParallelPolicySequence();
        this.noRunningTasks = true;
        this.currentChildIndex = 0;
        this.lastResult = ParallelResult.Running;
    }

    public run(): void {
        this.orchestrator.execute(this);
    }

    public childSuccess(runningTask: Task): void {
        this.lastResult = this.policy.onChildSuccess(this);
    }

    public childFail(runningTask: Task): void {
        this.lastResult = this.policy.onChildFail(this);
    }

    public childRunning(runningTask: Task, reporter: Task): void {
        this.noRunningTasks = false;
    }

    public resetTask(): void {
        super.resetTask();
        this.noRunningTasks = true;
    }

    public reset(): void {
        this.policy = new ParallelPolicySequence();
        this.orchestrator = new ParallelOrchestratorResume();
        this.noRunningTasks = true;
        this.lastResult = ParallelResult.Running;
    }

    public resetAllChildren(): void {
        for (let i = 0, n = this.getChildCount(); i < n; ++i) {
            const child = this.getChild(i);
            child.reset();
        }
    }
}