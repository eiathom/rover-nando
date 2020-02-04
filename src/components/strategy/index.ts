import { Commandable } from "../mediator/index";
import { Bound } from "../observer/index";
import { Position } from "../observer/index";

enum Direction {
    LEFT = "L", RIGHT = "R",
}

enum Movement {
    MOVE = "M",
}

enum Heading {
    NORTH = "N", SOUTH = "S", EAST = "E", WEST = "W",
}

// Strategy
interface Strategical {
    execute: () => void;
}

// Specific Strategy
interface Moveable extends Strategical {
    /*
     * Compute the journey from the current position with the new position
     */
    move: (position: Position, command: Commandable) => Position;
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
     * @Override
     */
    public execute(): void {
        logger.info("execute...");
    }
    /*
     * @Overrride
     * Move from the current position to a position computed from input parameters
     */
    public move(position: Position, command: Commandable): Position {
        for (const sequence of command.getCommands()) {
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

export {
    Strategical,
    Moveable,
    MoveRover,
};
