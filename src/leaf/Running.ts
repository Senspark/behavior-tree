import { LeafTask } from "../LeafTask";
import { TaskStatus } from "../TaskStatus";

export class Running<T> extends LeafTask<T> {
    public execute(): TaskStatus {
        return TaskStatus.Running;
    }
}