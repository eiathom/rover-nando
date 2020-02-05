import { logger } from "./services/logging/index";

enum Heading {
    NORTH = "N", SOUTH = "S", EAST = "E", WEST = "W",
}

enum Direction {
    LEFT = "L", RIGHT = "R",
}

enum Movement {
    MOVE = "M",
}

/*
 * A command is a sequence of input a rover can be instructed to operate on
 */
class Command {
    private sequence: Array<Direction|Movement>;
    constructor() {
        this.sequence = [];
    }
    public addSequence(sequence: Array<Direction|Movement>): void {
        this.sequence.push(...sequence);
    }
    public getSequence(): Array<Direction|Movement> {
        return this.sequence;
    }
}

/*
 * A message encapsulates a series of commands to send to a rover
 */
class Message {
    private commands: Command[];
    constructor() {
        this.commands = [];
    }
    public addCommand(command: Command): void {
        this.commands.push(command);
    }
    public getCommands(): Command[] {
        return this.commands;
    }
}

// publisher
// sender
// observer::subject
// behaviour
interface Communicable {
    /*
     * Initiate a broadcast to all observers to perform a behaviour (action)
     */
    notifyAll: () => void;
    notifySpecific: (observer: Observable) => void;
}

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

// Strategy
interface Moveable {
    /*
     * Compute the journey from the current position with the new position
     */
    move: (position: Position, command: Command) => Position;
}

// Concrete Strategy
class MoveRover implements Moveable {
    // we default to a move step of 1
    private readonly step: number = 1;
    private lowerBound: Bound;
    private upperBound: Bound;
    constructor(lowerBound: Bound, upperBound: Bound) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
    }
    /*
     * @Overrride
     * Move from the current position to a position computed from input parameters
     */
    public move(position: Position, command: Command): Position {
        for (const sequence of command.getSequence()) {
            logger.info("inputOfSequence::", sequence);
            this.algorithm(position, sequence);
        }
        return position;
    }
    public getUpperBound(): Bound {
        return this.upperBound;
    }
    public setUpperBound(x: number, y: number): void {
        this.upperBound.setX(x);
        this.upperBound.setY(y);
    }
    private validYMove(step: number): boolean {
        return (step >= this.lowerBound.getY() && step <= this.upperBound.getY());
    }
    private validXMove(step: number): boolean {
        return (step >= this.lowerBound.getX() && step <= this.upperBound.getX());
    }
    /*
     * N === y + M
     * S === y - M
     * E === x + M
     * W === x - M
     */
    private changePositionMove(position: Position): Position {
        if (position.getHeading() === Heading.NORTH) {
            const step: number = position.getBound().getY() + this.step;
            if (this.validYMove(step)) {
                logger.info("Moving Forward by", this.step);
                position.getBound().setY(step);
            }
        } else if (position.getHeading() === Heading.SOUTH) {
            const step: number = position.getBound().getY() - this.step;
            if (this.validYMove(step)) {
                logger.info("Moving Down by", this.step);
                position.getBound().setY(step);
            }
        } else if (position.getHeading() === Heading.EAST) {
            const step: number = position.getBound().getX() + this.step;
            if (this.validXMove(step)) {
                logger.info("Moving Right by", this.step);
                position.getBound().setX(step);
            }
        } else if (position.getHeading() === Heading.WEST) {
            const step: number = position.getBound().getX() - this.step;
            if (this.validXMove(step)) {
                logger.info("Moving Left by", this.step);
                position.getBound().setX(step);
            }
        }
        logger.info("Position is now::", position);
        return position;
    }
    /*
     * N + L === W
     * S + L === E
     * E + L === N
     * W + L === S
     * N + R === E
     * S + R === W
     * E + R === S
     * W + R === N
     */
    private changePositionHeading(position: Position, direction: Direction): Position {
        if (direction === Direction.LEFT) {
            logger.info("Changing Heading to the LEFT...");
            if (position.getHeading() === Heading.NORTH) {
                logger.info("Heading will now be WEST...");
                position.setHeading(Heading.WEST);
            } else if (position.getHeading() === Heading.SOUTH) {
                logger.info("Heading will now be EAST...");
                position.setHeading(Heading.EAST);
            } else if (position.getHeading() === Heading.EAST) {
                logger.info("Heading will now be NORTH...");
                position.setHeading(Heading.NORTH);
            } else if (position.getHeading() === Heading.WEST) {
                logger.info("Heading will now be SOUTH...");
                position.setHeading(Heading.SOUTH);
            }
        } else {
            logger.info("Changing Heading to the RIGHT...");
            if (position.getHeading() === Heading.NORTH) {
                logger.info("Heading will now be EAST...");
                position.setHeading(Heading.EAST);
            } else if (position.getHeading() === Heading.SOUTH) {
                logger.info("Heading will now be WEST...");
                position.setHeading(Heading.WEST);
            } else if (position.getHeading() === Heading.EAST) {
                logger.info("Heading will now be SOUTH...");
                position.setHeading(Heading.SOUTH);
            } else if (position.getHeading() === Heading.WEST) {
                logger.info("Heading will now be NORTH...");
                position.setHeading(Heading.NORTH);
            }
        }
        return position;
    }
    private algorithm(position: Position, inputOfSequence: Direction | Movement): Position {
        if (inputOfSequence === Movement.MOVE) {
            logger.info("Move Command");
            this.changePositionMove(position);
        } else {
            logger.info("Change Heading Command");
            this.changePositionHeading(position, inputOfSequence);
        }
        return position;
    }
}

const unSet: (input: any) => boolean = (input: any) => !input;

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

// enables communication between Subject and Observer
class Mediator {
    private map: Map<Rover, Message[]>;
    constructor() {
        this.map = new Map();
    }
    public push(rover: Rover, message: Message): void {
        let messages: Message[] | undefined = this.map.get(rover);
        if (!messages) {
            messages = [];
            this.map.set(rover, messages);
        }
        messages.push(message);
        this.map.set(rover, messages);
    }
    public pull(rover: Rover): Message[] | undefined {
        let messages: Message[] | undefined = this.map.get(rover);
        if (!messages) {
            messages = [];
            this.map.set(rover, messages);
        }
        return this.map.get(rover);
    }
    public flush(rover: Rover): void {
        this.map.set(rover, []);
    }
}

// Subject
class Operator implements Communicable {
    private rovers: Observable[];
    private mediator: Mediator;
    constructor(rovers: Observable[], mediator: Mediator) {
        this.rovers = unSet(rovers) ? [] : rovers;
        this.mediator = mediator;
    }
    /*
     * @Override
     */
    public notifyAll(): void {
        logger.info("notifyAll::", this.rovers);
        for (const rover of this.rovers) {
            rover.notify();
        }
    }
    /*
     * @Override
     */
    public notifySpecific(observer: Observable): void {
        const knownObserver: Observable | undefined = this.rovers.find((o) => o === observer);
        if (knownObserver) {
            knownObserver.notify();
        } else {
            logger.warn("unknown observer", observer);
        }
    }
    public getRovers(): Observable[] {
        return this.rovers;
    }
    public addRover(rover: Observable): void {
        this.rovers.push(rover);
    }
}

// Observer
class Rover implements Observable {
    private id: string;
    private previousPosition: Position;
    private currentPosition: Position;
    private moveRover: MoveRover;
    private mediator: Mediator;
    constructor(id: string, position: Position, mediator: Mediator, moveRover: MoveRover) {
        this.id = unSet(id) ? this.generateId() : id;
        this.previousPosition = new Position(position.getBound(), position.getHeading());
        this.currentPosition = new Position(position.getBound(), position.getHeading());
        this.mediator = mediator;
        this.moveRover = moveRover;
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
    public getId(): string {
        return this.id;
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
    private generateId(): string {
        return Math.random().toString(11).replace("0.", "");
    }
}

export {
    Operator,
    Rover,
    Bound,
    Position,
    Mediator,
    Heading,
    Observable,
    Message,
    Command,
    Direction,
    Movement,
    MoveRover,
};
