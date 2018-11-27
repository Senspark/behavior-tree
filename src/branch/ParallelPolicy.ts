import { Parallel } from "./Parallel";
import { ParallelResult } from "./ParallelResult";

export interface ParallelPolicy {
    onChildSuccess<T>(parallel: Parallel<T>): ParallelResult;

    /**
     * Called by parallel task each time one of its children fails.
     * @param parallel The parallel task.
     * Return True if parallel must succeed, false if parallel must fail and
     */
    onChildFail<T>(parallel: Parallel<T>): ParallelResult;
}