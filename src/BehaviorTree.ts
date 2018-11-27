import { Task } from "./Task";

export interface BehaviorTree {
    guardEvaluator: Task;

    /**
     * This method should be called when game entity needs to make decisions:
     * call this in game loop or after a fixed time slice if the game is real-time,
     * or on entity's turn if the game is turn-based.
     */
    step(): void;
}