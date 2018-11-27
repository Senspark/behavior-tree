import { BaseBehaviorTree } from "../BaseBehaviorTree";
import { BaseTask } from "../BaseTask";
import { Task } from "../Task";
import { TaskStatus } from "../TaskStatus";

export class ChangeData<T, U> extends BaseTask<T> {
    private mapper: (data: T) => U;
    private mapTree: BaseBehaviorTree<U>;

    public constructor(mapper: (dat: T) => U, rootTask: BaseTask<U>) {
        super();
        this.mapper = mapper;
        this.mapTree = new BaseBehaviorTree(rootTask);
    }

    public addChild(child: Task): this {
        throw new Error('This node cannot have any child.');
    }

    public getChildCount(): number {
        return 0;
    }

    public getChild(index: number): Task {
        throw new Error('This node does not have any child.');
    }

    public run(): void {
        const data = this.getObject();
        const mappedData = this.mapper(data);
        this.mapTree.setObject(mappedData);
        this.mapTree.step();
        const status = this.mapTree.getStatus();
        switch (status) {
            case TaskStatus.Succeeded:
                this.success();
                break;
            case TaskStatus.Failed:
                this.fail();
                break;
            case TaskStatus.Running:
                this.running();
                break;
        }
    }

    public childSuccess(runningTask: Task): void {
    }

    public childFail(runningTask: Task): void {
    }

    public childRunning(runningTask: Task, reporter: Task): void {
    }
}