import { TaskStatus } from "../TaskStatus";
import { Parallel } from "./Parallel";
import { ParallelOrchestratorJoin } from "./ParallelOrchestratorJoin";
import { ParallelOrchestratorResume } from "./ParallelOrchestratorResume";
import { ParallelPolicy } from "./ParallelPolicy";
import { ParallelResult } from "./ParallelResult";

export class ParallelPolicySequence implements ParallelPolicy {
    public onChildSuccess<T>(parallel: Parallel<T>): ParallelResult {
        if (parallel.orchestrator instanceof ParallelOrchestratorJoin) {
            if (parallel.noRunningTasks) {
                const lastChild = parallel.getChild(parallel.getChildCount() - 1);
                if (lastChild.getStatus() === TaskStatus.Succeeded) {
                    return ParallelResult.Succeed;
                }
            }
            return ParallelResult.Running;
        }
        if (parallel.orchestrator instanceof ParallelOrchestratorResume) {
            if (parallel.noRunningTasks) {
                if (parallel.currentChildIndex === parallel.getChildCount() - 1) {
                    return ParallelResult.Succeed;
                }
            }
            return ParallelResult.Running;
        }
        throw new Error('Invalid orchestrator.');
    }

    public onChildFail<T>(parallel: Parallel<T>): ParallelResult {
        return ParallelResult.Fail;
    }
}