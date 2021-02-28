import { unSet } from "../util";

enum Heading {
    NORTH = "N", SOUTH = "S", EAST = "E", WEST = "W"
}

enum Direction {
    LEFT = "L", RIGHT = "R"
}

enum Movement {
    MOVE = "M"
}

/*
 * A command is a sequence of input
 */
class Command {
    private sequence: Array<Direction|Movement>;
    constructor() {
        this.sequence = [];
    }
    public addSequence = (sequence: Array<Direction|Movement>): void => {
        this.sequence.push(...sequence);
    }
    public getSequence = (): Array<Direction|Movement> => {
        return this.sequence;
    }
    public toString = (): string => `command: ${this.sequence}`;
}

/*
 * A message encapsulates a series of commands
 */
class Message {
    private commands: Array<Command>;
    constructor() {
        this.commands = [];
    }
    public addCommand = (command: Command): void => {
        this.commands.push(command);
    }
    public getCommands = (): Array<Command> => {
        return this.commands;
    }
    public toString = (): string => `message: ${this.getCommands()}`;
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
    public getX = (): number => {
        return this.x;
    }
    public getY = (): number => {
        return this.y;
    }
    public setX = (x: number): void => {
        this.x = x;
    }
    public setY = (y: number): void => {
        this.y = y;
    }
    public toString = (): string => `bound: x=${this.getX()}, y=${this.getY()}`;
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
    public getBound = (): Bound => {
        return this.bound;
    }
    public getHeading = (): Heading => {
        return this.heading;
    }
    public setBound = (bound: Bound): void => {
        this.bound = bound;
    }
    public setHeading = (heading: Heading): void => {
        this.heading = heading;
    }
    public toString = (): string => `position: bound=${this.getBound()}, heading=${this.getHeading()}`;
}

export {
    Bound,
    Command,
    Direction,
    Heading,
    Movement,
    Message,
    Position,
};
