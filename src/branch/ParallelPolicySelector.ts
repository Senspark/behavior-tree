import { Parallel } from "./Parallel";
import { ParallelPolicy } from "./ParallelPolicy";
import { ParallelResult } from "./ParallelResult";

export class ParallelPolicySelector implements ParallelPolicy {
    public onChildSuccess<T>(parallel: Parallel<T>): ParallelResult {
        return ParallelResult.Succeed;
    }

    public onChildFail<T>(parallel: Parallel<T>): ParallelResult {
        if (parallel.noRunningTasks) {
            if (parallel.currentChildIndex === parallel.getChildCount() - 1) {
                return ParallelResult.Fail;
            }
        }
        return ParallelResult.Running;
    }
}