import { logger } from "../../services/logging/index";
import { isUnSet } from "../../services/util/index";
import { Mediatable } from "../mediator/index";
import { Sendable } from "../mediator/index";
import { Heading } from "../strategy/index";
import { Moveable } from "../strategy/index";
import { Strategical } from "../strategy/index";

interface Observable {
    notify: () => void;
}

class Bound {
    private x: number;
    private y: number;
    constructor(x: number, y: number) {
        this.x = isUnSet(x) ? -1 : x;
        this.y = isUnSet(y) ? -1 : y;
    }
    public getX(): number {
        return this.x;
    }
    public getY(): number {
        return this.y;
    }
    public setX(x: number): void {
        this.x = x;
    }
    public setY(y: number): void {
        this.y = y;
    }
}

class Position {
    private bound: Bound;
    private heading: Heading;
    constructor(bound: Bound, heading: Heading) {
        this.bound = bound;
        this.heading = heading;
    }
    public getBound(): Bound {
        return this.bound;
    }
    public getHeading(): Heading {
        return this.heading;
    }
    public setBound(bound: Bound): void {
        this.bound = bound;
    }
    public setHeading(heading: Heading): void {
        this.heading = heading;
    }
}

abstract class BaseObserver implements Observable {
    private id: string;
    private mediator: Mediatable;
    private strategy: Strategical;
    constructor(id: string, mediator: Mediatable, strategy: Strategical) {
        this.id = isUnSet(id) ? this.generateId() : id;
        this.mediator = mediator;
        this.strategy = strategy;
    }
    public abstract notify(): void;
    public getId(): string {
        return this.id;
    }
    public getMediatable(): Mediatable {
        return this.mediator;
    }
    public getStrategical(): Strategical {
        return this.strategy;
    }
    private generateId(): string {
        return Math.random().toString(11).replace("0.", "");
    }
}

class Observer extends BaseObserver {
    private previousPosition: Position;
    private currentPosition: Position;
    constructor(id: string, position: Position, mediator: Mediatable, strategy: Strategical) {
        super(id, mediator, strategy);
        this.previousPosition = new Position(position.getBound(), position.getHeading());
        this.currentPosition = new Position(position.getBound(), position.getHeading());
    }
    /*
     * @Override
     */
    public notify(): void {
        logger.info("notify::", this.getId());
        const messages: Sendable[] | undefined = this.getMediatable().pull(this);
        if (messages) {
            for (const message of messages) {
                logger.info("message::", this.getId(), message);
                for (const command of message.getContent()) {
                    logger.info("command::", this.getId(), command.getCommands());
                    const cachePosition: Position = new Position(this.getCurrentPosition().getBound(),
                                                                 this.getCurrentPosition().getHeading());
                    logger.info("currentPosition::", this.getId(), cachePosition);
                    this.setPreviousPosition(cachePosition);
                    this.getStrategical().execute();
                    logger.info("previousPosition::", this.getId(), this.getPreviousPosition());
                    logger.info("currentPosition::", this.getId(), this.getCurrentPosition());
                }
            }
        }
        this.getMediatable().flush(this);
    }
    public getPreviousPosition(): Position {
        return this.previousPosition;
    }
    public getCurrentPosition(): Position {
        return this.currentPosition;
    }
    public setPreviousPosition(position: Position): void {
        this.previousPosition = new Position(new Bound(position.getBound().getX(), position.getBound().getY()),
                                             position.getHeading());
    }
    public setCurrentPosition(position: Position): void {
        this.currentPosition = new Position(new Bound(position.getBound().getX(), position.getBound().getY()),
                                            position.getHeading());
    }
}

export {
    BaseObserver,
    Bound,
    Observable,
    Observer,
    Position,
};
