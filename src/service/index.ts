import {
    Bound,
    Command,
    Direction,
    Heading,
    Movement,
    Message,
    Position,
} from "../model";

import {
    log,
    unSet,
} from "../util";

interface Communicable {
    /*
     * Initiate a broadcast to all observers to perform a behaviour (action)
     */
    notifyAll(): void;
}

interface Observable {
    /*
     * Notify observers to perform a behaviour (action)
     */
    notify(): void;
    toString(): string;
}

interface Moveable {
    /*
     * Compute the journey from the current position from a new command
     */
    move(position: Position, command: Command): Position;
}

// Abstract Strategy
abstract class AbstractMove implements Moveable {
    protected abstract algorithm(position: Position, inputOfSequence: Direction | Movement): Position;
    public move = (position: Position, command: Command): Position => {
        for (const sequence of command.getSequence()) {
            log.info(`inputOfSequence::${sequence}`);
            this.algorithm(position, sequence);
        }
        return position;
    }
}

// Concrete Strategy
class MoveRover extends AbstractMove {
    // we default to a move step of 1
    private readonly step: number = 1;
    private lowerBound: Bound;
    private upperBound: Bound;
    constructor(lowerBound: Bound, upperBound: Bound) {
        super();
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }
    public getUpperBound = (): Bound => {
        return this.upperBound;
    }
    public setUpperBound = (x: number, y: number): void => {
        this.upperBound.setX(x);
        this.upperBound.setY(y);
    }
    public validYMove = (step: number): boolean => {
        return (step >= this.lowerBound.getY() && step <= this.upperBound.getY());
    }
    public validXMove = (step: number): boolean => {
        return (step >= this.lowerBound.getX() && step <= this.upperBound.getX());
    }
    public changePositionMove = (position: Position): Position => {
        if (position.getHeading() === Heading.NORTH) {
            const step: number = position.getBound().getY() + this.step;
            if (this.validYMove(step)) {
                position.getBound().setY(step);
            }
        } else if (position.getHeading() === Heading.SOUTH) {
            const step: number = position.getBound().getY() - this.step;
            if (this.validYMove(step)) {
                position.getBound().setY(step);
            }
        } else if (position.getHeading() === Heading.EAST) {
            const step: number = position.getBound().getX() + this.step;
            if (this.validXMove(step)) {
                position.getBound().setX(step);
            }
        } else if (position.getHeading() === Heading.WEST) {
            const step: number = position.getBound().getX() - this.step;
            if (this.validXMove(step)) {
                position.getBound().setX(step);
            }
        }

        return position;
    }
    public changePositionHeading = (position: Position, direction: Direction): Position => {
        if (direction === Direction.LEFT) {
            if (position.getHeading() === Heading.NORTH) {
                position.setHeading(Heading.WEST);
            } else if (position.getHeading() === Heading.SOUTH) {
                position.setHeading(Heading.EAST);
            } else if (position.getHeading() === Heading.EAST) {
                position.setHeading(Heading.NORTH);
            } else if (position.getHeading() === Heading.WEST) {
                position.setHeading(Heading.SOUTH);
            }
        } else {
            if (position.getHeading() === Heading.NORTH) {
                position.setHeading(Heading.EAST);
            } else if (position.getHeading() === Heading.SOUTH) {
                position.setHeading(Heading.WEST);
            } else if (position.getHeading() === Heading.EAST) {
                position.setHeading(Heading.SOUTH);
            } else if (position.getHeading() === Heading.WEST) {
                position.setHeading(Heading.NORTH);
            }
        }
        return position;
    }
    protected algorithm = (position: Position, inputOfSequence: Direction | Movement): Position => {
        if (inputOfSequence === Movement.MOVE) {
            this.changePositionMove(position);
        } else {
            this.changePositionHeading(position, inputOfSequence);
        }
        return position;
    }
}

interface Mediationable {
    push(observable: Observable, message: Message): void;
    pull(observable: Observable): Array<Message> | undefined;
    flush(observable: Observable): void;
}

// enables communication between Subject and Observer
abstract class AbstractMediator<T extends Observable> implements Mediationable {
    protected map: Map<T, Array<Message>>;
    constructor() {
        this.map = new Map();
    }
    abstract push(observable: Observable, message: Message): void;
    abstract pull(observable: Observable): Message[] | undefined;
    abstract flush(observable: Observable): void;
}

// Concrete Mediator
class ConcreteMediator extends AbstractMediator<Rover> {
    constructor() {
        super();
    }
    public push = (observable: Rover, message: Message): void => {
        let messages: Array<Message> | undefined = this.map.get(observable);
        if (!messages) {
            messages = [];
            this.map.set(observable, messages);
        }
        messages.push(message);
        this.map.set(observable, messages);
    }
    public pull = (observable: Rover): Array<Message> | undefined => {
        let messages: Array<Message> | undefined = this.map.get(observable);
        if (!messages) {
            messages = [];
            this.map.set(observable, messages);
        }
        return this.map.get(observable);
    }
    public flush = (observable: Rover): void => {
        this.map.set(observable, []);
    }
}

// Subject
class Operator implements Communicable {
    private observables: Array<Observable>;
    private mediator: Mediationable;
    constructor(observables: Array<Observable>, mediator: Mediationable) {
        this.observables = unSet(observables) ? [] : observables;
        this.mediator = mediator;
    }
    public getObservables = (): Array<Observable> => {
        return this.observables;
    }
    public addObservable = (rover: Observable): void => {
        this.observables.push(rover);
    }
    public getMediator = (): Mediationable => {
        return this.mediator;
    }
    public notifyAll = (): void => {
        log.info(`notifyAll::${this.getObservables()}`);
        for (const rover of this.observables) {
            rover.notify();
        }
    }
}

// Observer
class Rover implements Observable {
    private id: string;
    private previousPosition: Position;
    private currentPosition: Position;
    private abstractMoveable: Moveable;
    private mediator: Mediationable;
    constructor(id: string, position: Position, mediator: Mediationable, abstractMoveable: Moveable) {
        this.id = unSet(id) ? this.generateId() : id;
        this.previousPosition = new Position(position.getBound(), position.getHeading());
        this.currentPosition = new Position(position.getBound(), position.getHeading());
        this.mediator = mediator;
        this.abstractMoveable = abstractMoveable;
    }
    /*
     * @Override
     * Once we receive a notification, we can begin to apply commands to the Rover instance
     */
    notify(): void {
        log.info(`notify::${this.getId()}`);
        const messages: Array<Message> | undefined = this.mediator.pull(this);
        if (messages) {
            for (const message of messages) {
                log.info(`notification::${this.getId()}, ${message}`);
                for (const command of message.getCommands()) {
                    log.info(`action::${this.getId()}, ${command}`);
                    const cachePosition: Position = new Position(this.getCurrentPosition().getBound(), this.getCurrentPosition().getHeading());
                    log.info(`currentPosition::${this.getId()},${cachePosition}`);
                    this.setPreviousPosition(cachePosition);
                    const currentPosition: Position = this.abstractMoveable.move(this.getCurrentPosition(), command);
                    this.setCurrentPosition(currentPosition);
                    log.info(`previousPosition::${this.getId()}, ${this.getPreviousPosition()}`);
                    log.info(`currentPosition::${this.getId()}, ${this.getCurrentPosition()}`);
                }
            }
        }
        this.mediator.flush(this);
    }
    public getId = (): string => {
        return this.id;
    }
    public getPreviousPosition = (): Position => {
        return this.previousPosition;
    }
    public getCurrentPosition = (): Position => {
        return this.currentPosition;
    }
    public setPreviousPosition = (position: Position): void => {
        this.previousPosition = new Position(new Bound(position.getBound().getX(), position.getBound().getY()), position.getHeading());
    }
    public setCurrentPosition = (position: Position): void => {
        this.currentPosition = new Position(new Bound(position.getBound().getX(), position.getBound().getY()), position.getHeading());
    }
    public toString = (): string => `${this.getId()}`;
    private generateId(): string {
        return Math.random().toString(11).replace("0.", "");
    }
}

export {
    ConcreteMediator,
    AbstractMove,
    Mediationable,
    Operator,
    Rover,
    AbstractMediator,
    Observable,
    MoveRover
};
