import { Parallel } from "./Parallel";

export interface ParallelOrchestrator {
    /** Called by parallel task each run. */
    execute<T>(parallel: Parallel<T>): void;
}