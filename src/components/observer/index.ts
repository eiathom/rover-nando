import { Mediatable } from "../mediator/index";
import { isUnSet } from "../services/util/index";
import { Moveable } from "../strategy/index";
import { Strategical } from "../strategy/index";

// subscriber
// receiver
// observer::observer
// behavior
interface Observable {
    /*
     * Notify observers to perform a behaviour (action)
     */
    notify: () => void;
}

// Observer
abstract class BaseObserver implements Observable {
    private id: string;
    private mediator: Mediatable;
    private strategy: Strategical;
    constructor(id: string, mediator: Mediatable, strategy: Strategical) {
        this.id = isUnSet(id) ? this.generateId() : id;
        this.mediator = mediator;
        this.strategy = strategy;
    }
    public getId(): string {
        return this.id;
    }
    private generateId(): string {
        return Math.random().toString(11).replace("0.", "");
    }
}

/*
 * A bound represents an X, Y location
 */
class Bound {
    private x: number;
    private y: number;
    constructor(x: number, y: number) {
        this.x = unSet(x) ? -1 : x;
        this.y = unSet(y) ? -1 : y;
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

/*
 * A position is made up of a bound (location) and a heading (point of view)
 */
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

// Concrete Observer
class Rover extends BaseObserver {
    private previousPosition: Position;
    private currentPosition: Position;
    constructor(id: string, position: Position, mediator: Mediator, moveRover: MoveRover) {
        super(id, mediator, moveRover);
        this.previousPosition = new Position(position.getBound(), position.getHeading());
        this.currentPosition = new Position(position.getBound(), position.getHeading());
    }
    /*
     * @Override
     * Once we receive a notification, we can begin to apply commands to the Rover instance
     */
    public notify(): void {
        logger.info("notify::", this.getId());
        const messages: Message[] | undefined = this.mediator.pull(this);
        if (messages) {
            for (const message of messages) {
                logger.info("message::", this.getId(), message);
                for (const command of message.getCommands()) {
                    logger.info("command::", this.getId(), command.getSequence());
                    const cachePosition: Position = new Position(this.getCurrentPosition().getBound(),
                                                                 this.getCurrentPosition().getHeading());
                    logger.info("currentPosition::", this.getId(), cachePosition);
                    this.setPreviousPosition(cachePosition);
                    const currentPosition: Position = this.moveRover.move(this.getCurrentPosition(), command);
                    this.setCurrentPosition(currentPosition);
                    logger.info("previousPosition::", this.getId(), this.getPreviousPosition());
                    logger.info("currentPosition::", this.getId(), this.getCurrentPosition());
                }
            }
        }
        this.mediator.flush(this);
    }
    public getPreviousPosition(): Position {
        return this.previousPosition;
    }
    public getCurrentPosition(): Position {
        return this.currentPosition;
    }
    public getUpperBound(): Bound {
        return this.moveRover.getUpperBound();
    }
    public setPreviousPosition(position: Position): void {
        this.previousPosition = new Position(new Bound(position.getBound().getX(), position.getBound().getY()),
                                             position.getHeading());
    }
    public setCurrentPosition(position: Position): void {
        this.currentPosition = new Position(new Bound(position.getBound().getX(), position.getBound().getY()),
                                            position.getHeading());
    }
    public setUpperBound(x: number, y: number): void {
        this.moveRover.setUpperBound(x, y);
    }
}

export {
    BaseObserver,
    Observable,
    Rover,
};
