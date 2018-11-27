import { LeafTask } from "../base";
import { TaskStatus } from "../TaskStatus";

/** Success is a leaf that immediately succeeds. */
export class Success<T> extends LeafTask<T> {
    public execute(): TaskStatus {
        return TaskStatus.Succeeded;
    }
}
