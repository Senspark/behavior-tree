import { TaskStatus } from "../TaskStatus";
import { Parallel } from "./Parallel";
import { ParallelOrchestrator } from "./ParallelOrchestrator";
import { ParallelResult } from "./ParallelResult";

/**
 * Children execute until they succeed or fail but will not re-run until
 * the parallel task has succeeded or failed.
 */
export class ParallelOrchestratorJoin implements ParallelOrchestrator {
    public execute<T>(parallel: Parallel<T>): void {
        parallel.noRunningTasks = true;
        parallel.lastResult = ParallelResult.Running;
        const n = parallel.getChildCount();
        for (parallel.currentChildIndex = 0; parallel.currentChildIndex < n; ++parallel.currentChildIndex) {
            const child = parallel.getChild(parallel.currentChildIndex);
            switch (child.getStatus()) {
                case TaskStatus.Running:
                    child.run();
                    break;
                case TaskStatus.Succeeded:
                case TaskStatus.Failed:
                    break;
                default:
                    child.setControl(parallel);
                    child.start();
                    if (child.checkGuard(parallel)) {
                        child.run();
                    } else {
                        child.fail();
                    }
                    break;
            }
            if (parallel.lastResult !== ParallelResult.Running) {
                // Current child has finished either with success or fail.
                parallel.cancelRunningChildren(parallel.noRunningTasks ? parallel.currentChildIndex + 1 : 0);
                parallel.resetAllChildren();
                if (parallel.lastResult !== ParallelResult.Running) {
                    parallel.success();
                } else {
                    parallel.fail();
                }
                return;
            }
        }
        parallel.running();
    }
}