import { TaskStatus } from "../TaskStatus";
import { Parallel } from "./Parallel";
import { ParallelOrchestrator } from "./ParallelOrchestrator";
import { ParallelResult } from "./ParallelResult";

/**
 * Starts or resumes all children every single step.
 */
export class ParallelOrchestratorResume implements ParallelOrchestrator {
    public execute<T>(parallel: Parallel<T>): void {
        parallel.noRunningTasks = true;
        parallel.lastResult = ParallelResult.Running;
        const n = parallel.getChildCount();
        for (parallel.currentChildIndex = 0; parallel.currentChildIndex < n; ++parallel.currentChildIndex) {
            const child = parallel.getChild(parallel.currentChildIndex);
            if (child.getStatus() === TaskStatus.Running) {
                child.run();
            } else {
                child.setControl(parallel);
                child.start();
                if (child.checkGuard(parallel)) {
                    child.run();
                } else {
                    child.fail();
                }
            }
            if (parallel.lastResult !== ParallelResult.Running) {
                // Current child has finished either with success or fail.
                parallel.cancelRunningChildren(parallel.noRunningTasks ? parallel.currentChildIndex + 1 : 0);
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