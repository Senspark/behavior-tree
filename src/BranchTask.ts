import { BaseTask } from "./BaseTask";
import { Task } from "./Task";

/**
 * A branch task defines a behavior tree branch,
 * contains logic of starting or running sub-branches and leaves.
 */
export abstract class BranchTask<T> extends BaseTask<T> {
    protected children: Task[];

    public constructor(...children: Task[]) {
        super();
        this.children = children;
    }

    public addChild(child: Task): this {
        this.children.push(child);
        return this;
    }

    public getChildCount(): number {
        return this.children.length;
    }

    public getChild(index: number): Task {
        return this.children[index];
    }

    public reset(): void {
        super.reset();
        this.children = [];
    }
}