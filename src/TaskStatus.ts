export enum TaskStatus {
    /** Means that the task has never run or has been reset. */
    Invalid,

    /** Means that the task returned a success result. */
    Succeeded,

    /** Means that the task returned a failure result.  */
    Failed,

    /** Means that the task needs to run again. */
    Running,

    /** Means that the task has been terminated by an ancestor. */
    Canceled,
}