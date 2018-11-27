import { Decorator } from "../base";
import { Task } from "../Task";
import { TaskStatus } from "../TaskStatus";

/**
 * LoopDecorator is an abstract class providing basic functionalities
 * for concrete looping decorators.
 */
export abstract class LoopDecorator<T> extends Decorator<T> {
    protected loop: boolean;

    public constructor() {
        super();
        this.loop = false;
    }

    public condition(): boolean {
        return this.loop;
    }

    public run(): void {
        if (this.child === undefined) {
            throw new Error('Invalid status.');
        }
        while (this.condition()) {
            if (this.child.getStatus() === TaskStatus.Running) {
                this.child.run();
            } else {
                this.child.setControl(this);
                this.child.start();
                if (this.child.checkGuard(this)) {
                    this.child.run();
                } else {
                    this.child.fail();
                }
            }
        }
    }

    public childRunning(runningTask: Task, reporter: Task): void {
        super.childRunning(runningTask, reporter);
        this.loop = false;
    }

    public reset(): void {
        super.reset();
        this.loop = false;
    }
}