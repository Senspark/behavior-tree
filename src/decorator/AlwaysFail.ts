import { Decorator } from "../Decorator";
import { Task } from "../Task";

/** An AlwaysFail decorator will fail no matter the wrapped task fails or succeeds. */
export class AlwaysFail<T> extends Decorator<T> {
    public childSuccess(runningTask: Task): void {
        this.childFail(runningTask);
    }
}