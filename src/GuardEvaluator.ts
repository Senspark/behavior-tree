import { BaseBehaviorTree } from "./BaseBehaviorTree";
import { BaseTask } from "./BaseTask";
import { Task } from "./Task";

export class GuardEvaluator<T> extends BaseTask<T> {
    public constructor(tree: BaseBehaviorTree<T>) {
        super();
        this.tree = tree;
    }

    public addChild(child: Task): this {
        return this;
    }

    public getChildCount(): number {
        return 0;
    }

    public getChild(indeX: number): Task {
        throw new Error('GuardEvaulator does not have any child.');
    }

    public run(): void {
    }

    public childSuccess(runningTask: Task): void {
    }

    public childFail(runningTask: Task): void {
    }

    public childRunning(runningTask: Task, reporter: Task): void {
    }
}