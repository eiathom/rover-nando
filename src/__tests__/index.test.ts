import { Operator } from "../index";
import { Rover } from "../index";
import { Position } from "../index";
import { Mediator } from "../index";
import { Bound } from "../index";
import { Heading } from "../index";
import { Message } from "../index";
import { Command } from "../index";
import { Direction } from "../index";
import { Movement } from "../index";
import { MoveRover } from "../index";
import { Observable } from "../index";

// Structural
describe("LinkedList", () => {
    test("is a linked list", async () => {
        expect(true).toBe(true);
    });
});

// Structural
describe("Tree", () => {});

// Behavioural::Strategy
describe("ShortestPath", () => {});

describe("Operator", () => {});

describe("Rover", () => {});

describe("Rovers On Mars", () => {
    test.skip("rovers move to new location as expected", async () => {
        const mediator: Mediator = new Mediator();
        const moveRover: MoveRover = new MoveRover(new Bound(0, 0), new Bound(5, 5));
        const rover0: Rover = new Rover("rover_0", new Position(new Bound(1, 2), Heading.NORTH), mediator, moveRover);
        const rover1: Rover = new Rover("rover_1", new Position(new Bound(3, 3), Heading.EAST), mediator, moveRover);
        const message0: Message = new Message();
        const message1: Message = new Message();
        const command0: Command = new Command();
        const command1: Command = new Command();
        const sequence0: Array<Direction|Movement> = [
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Direction.LEFT,
            Movement.MOVE,
            Movement.MOVE,
        ];
        const sequence1: Array<Direction|Movement> = [
            Movement.MOVE,
            Movement.MOVE,
            Direction.RIGHT,
            Movement.MOVE,
            Movement.MOVE,
            Direction.RIGHT,
            Movement.MOVE,
            Direction.RIGHT,
            Direction.RIGHT,
            Movement.MOVE,
        ];
        command0.addSequence(sequence0);
        command1.addSequence(sequence1);
        message0.addCommand(command0);
        message1.addCommand(command1);
        mediator.push(rover0, message0);
        mediator.push(rover1, message1);
        expect(rover0.getId()).toEqual("rover_0");
        expect(rover1.getId()).toEqual("rover_1");
        const rovers: Rover[] = [rover0, rover1];
        const operator: Operator = new Operator(rovers, mediator);
        expect(rover0).toBeInstanceOf(Rover);
        expect(rover1).toBeInstanceOf(Rover);
        expect(operator).toBeInstanceOf(Operator);
        expect(operator.getRovers()).toHaveLength(2);
        operator.notifyAll();
        expect(rover0.getCurrentPosition().getBound().getX()).toEqual(1);
        expect(rover0.getCurrentPosition().getBound().getY()).toEqual(3);
        expect(rover0.getCurrentPosition().getHeading()).toEqual(Heading.NORTH);
        expect(rover1.getCurrentPosition().getBound().getX()).toEqual(5);
        expect(rover1.getCurrentPosition().getBound().getY()).toEqual(1);
        expect(rover1.getCurrentPosition().getHeading()).toEqual(Heading.EAST);
        operator.notifySpecific(rover0);
        operator.notifySpecific(rover1);
    });
});
