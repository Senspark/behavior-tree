import { TimeData } from "../data";
import { Decorator } from "../Decorator";

export class MultiplyTime<T extends TimeData> extends Decorator<T> {
    private multiplier: number;

    public constructor(multiplier: number) {
        super();
        this.multiplier = multiplier;
    }

    public start(): void {
        super.start();
        const data = this.getObject();
        data.delta *= this.multiplier;
    }

    public end(): void {
        super.end();
        const data = this.getObject();
        data.delta /= this.multiplier;
    }
}