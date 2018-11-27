import { LeafTask } from "../LeafTask";
import { TaskStatus } from "../TaskStatus";

/** Failure is a leaf that immediately fails. */
export class Failure<T> extends LeafTask<T> {
    public execute(): TaskStatus {
        return TaskStatus.Failed;
    }
}