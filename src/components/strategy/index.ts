import { logger } from "../../services/logging/index";

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

interface Strategical {
    execute: () => void;
}

interface Moveable extends Strategical {
    move: () => void;
}

abstract class BaseMoveStrategy implements Moveable {
    private readonly defaultStep: number = 1;
    private step: number;
    private lowerBound: Bound;
    private upperBound: Bound;
    private position: Position;
    private commandable: Commandable;
    constructor(lowerBound: Bound, upperBound: Bound, position: Position,
                commandable: Commandable, step: number = 1) {
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.position = position;
        this.commandable = commandable;
        this.step = this.isValidStep(step) ? step : this.defaultStep;
    }
    /*
     * @Override
     */
    public move(): void {
        for (const sequence of this.getCommandable().getCommands()) {
            logger.info("inputOfSequence::", sequence);
            this.algorithm(this.getPosition(), sequence);
        }
        this.getCommandable().flushCommands();
    }
    /*
     * @Override
     */
    public execute(): void {
        this.move();
    }
    public getStep(): number {
        return this.step;
    }
    public getPosition(): Position {
        return this.position;
    }
    public getCommandable(): Commandable {
        return this.commandable;
    }
    public getUpperBound(): Bound {
        return this.upperBound;
    }
    public setUpperBound(x: number, y: number): void {
        this.upperBound.setX(x);
        this.upperBound.setY(y);
    }
    private isValidStep(step: number): boolean {
        return step > 0;
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
            } else {
                logger.warn(`Cannot Move North by ${this.step}, Would Be Out Of Bounds!`);
            }
        } else if (position.getHeading() === Heading.SOUTH) {
            const step: number = position.getBound().getY() - this.step;
            if (this.validYMove(step)) {
                logger.info("Moving Down by", this.step);
                position.getBound().setY(step);
            } else {
                logger.warn(`Cannot Move South by ${this.step}, Would Be Out Of Bounds!`);
            }
        } else if (position.getHeading() === Heading.EAST) {
            const step: number = position.getBound().getX() + this.step;
            if (this.validXMove(step)) {
                logger.info("Moving Right by", this.step);
                position.getBound().setX(step);
            } else {
                logger.warn(`Cannot Move East by ${this.step}, Would Be Out Of Bounds!`);
            }
        } else if (position.getHeading() === Heading.WEST) {
            const step: number = position.getBound().getX() - this.step;
            if (this.validXMove(step)) {
                logger.info("Moving Left by", this.step);
                position.getBound().setX(step);
            } else {
                logger.warn(`Cannot Move West by ${this.step}, Would Be Out Of Bounds!`);
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

class MoveStrategy extends BaseMoveStrategy {
    constructor(lowerBound: Bound, upperBound: Bound, position: Position,
                commandable: Commandable, step: number = 1) {
        super(lowerBound, upperBound, position, commandable, step);
    }
}

export {
    BaseMoveStrategy,
    Direction,
    Heading,
    Moveable,
    Movement,
    MoveStrategy,
    Strategical,
};
